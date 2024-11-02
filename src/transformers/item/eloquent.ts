import naming from '../../helpers/naming';
import * as type from '../../helpers/type';
import { BaseTransformer } from './base';

type OnlyReadAttributes = {
  name: string;
  type: string;
};
type Relation = {
  reference: Record<string, string> | null;
  name: string;
  model: string;
};
type ModelConstant = {
  name: string;
  value: string;
};
type Attribute = {
  type: string;
  name: string;
};

export class Eloquent extends BaseTransformer {
  public transform() {
    const primaryKey =
      this.$item.primaryKey.columns.length === 0
        ? [this.$item.columns[0].name]
        : this.$item.primaryKey.columns;
    const result = {
      model: naming.modelClass(this.$item.table),
      table: this.$item.table,
      imports: [] as string[],
      namespace: 'App\\Models',
      recordLabel: null as string | null,
      belongsToRelations: [] as Relation[],
      hasManyRelations: [] as Relation[],
      attributes: [] as Attribute[],
      primaryKey:
        primaryKey.length === 1
          ? `'${primaryKey[0]}'`
          : `['${primaryKey.join("', '")}']`,
      onlyReadAttributes: [] as OnlyReadAttributes[],
      autoincrement: false,
      timestamps: false,
      constants: [] as ModelConstant[],
    };
    const imports = {
      [this.$config.eloquentParent(this.$item.table)]: true,
      'Kyslik\\ColumnSortable\\Sortable': true,
      'EloquentFilter\\Filterable': true,
    };
    let importCollection = false;
    this.$item.relations.forEach((relation) => {
      let relationClass = naming.modelClass(relation.on.table);
      const relationName = naming.relationAttribute(relation, this.$item.table);
      if (relation.on.table !== this.$item.table) {
        imports['App\\Models\\' + relationClass] = true;
      } else {
        imports[`App\\Models\\${relationClass} as ChildModel`] = true;
        relationClass = 'ChildModel';
      }
      let attributeType = relationClass;
      if (relation.type === 'has-many') {
        attributeType = `Collection<${attributeType}>`;
        importCollection = true;
      }
      result.onlyReadAttributes.push({
        name: relationName,
        type: attributeType,
      });
      const columns: Record<string, string> = {};
      let reference = null;
      if (relation.columns.length === 1) {
        reference =
          relation.type === 'has-many'
            ? {
                foreignKey: relation.references[0],
                localKey: relation.columns[0],
              }
            : {
                foreignKey: relation.columns[0],
                ownerKey: relation.references[0],
              };
      }
      for (const index in relation.columns) {
        columns[relation.references[index]] = relation.columns[index];
      }
      if (relation.type === 'has-many') {
        result.hasManyRelations.push({
          reference,
          name: relationName,
          model: relationClass,
        });
      } else {
        result.belongsToRelations.push({
          reference,
          name: relationName,
          model: relationClass,
        });
      }
    });

    let firstStringColumn: string | null = null;
    const firstColumn = this.$item.columns[0].name;
    let autoincrement = false;
    const timestamps = {
      created_at: false,
      updated_at: false,
    };
    this.$item.columns.forEach((column) => {
      if (column.enum && Array.isArray(column.enum)) {
        column.enum.forEach((value) => {
          result.constants.push({
            name: `${column.name}_${value}`.toUpperCase(),
            value: value,
          });
        });
      }
      if (!firstStringColumn && column.type === 'string') {
        firstStringColumn = column.name;
      }
      if (!autoincrement && column.autoincrement) {
        autoincrement = true;
      }
      if (!timestamps.created_at && column.name === 'created_at') {
        timestamps.created_at = true;
      }
      if (!timestamps.updated_at && column.name === 'updated_at') {
        timestamps.updated_at = true;
      }
      if (column.type === 'date') {
        imports['Illuminate\\Support\\Carbon'] = true;
      }
      result.attributes.push({
        type: type.phpType(column.type),
        name: column.name,
      });
    });
    result.recordLabel = firstStringColumn || firstColumn;
    result.autoincrement = autoincrement;
    result.timestamps = timestamps.created_at && timestamps.updated_at;

    if (importCollection) {
      imports['Illuminate\\Database\\Eloquent\\Collection'] = true;
    }
    result.imports = Object.keys(imports).sort();

    this.$item.laravel.eloquent = result;
  }
}
