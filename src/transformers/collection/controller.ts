import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';
import { Item, Relation } from 'generathor-db';
const ignoreAttributesFor: Record<string, boolean> = {
  created_at: true,
  updated_at: true,
};
export class Controller extends BaseTransformer {
  public transform(): TransformedItem[] {
    const result = [];
    const namespace = 'App\\Http\\Controllers\\Generathor';
    const requestNamespace = 'App\\Http\\Requests\\Generathor';
    const eloquentNamespace = 'App\\Models';
    const itemsByTable = this.mapByTable();

    for (const item of this.$items) {
      const imports: Record<string, boolean> = {};
      const hasManyRelations = [];
      const belongsToRelations = [];
      const model = naming.modelClass(item.table);
      const context = naming.context(item.table);
      const createRequest = `Create${model}Request`;
      const updateRequest = `Update${model}Request`;
      const filterRequest = `Filter${model}Request`;
      imports[`${eloquentNamespace}\\${model}`] = true;
      imports[`${requestNamespace}\\${createRequest}`] = true;
      imports[`${requestNamespace}\\${updateRequest}`] = true;
      imports[`${requestNamespace}\\${filterRequest}`] = true;
      const controller = naming.controller(item.table);
      const queryRelations = [];

      for (const relation of item.relations) {
        const label = naming.relationLabel(relation, item.table);
        queryRelations.push(naming.relationAttribute(relation, item.table));
        const capitalizedRelationAttribute =
          naming.capitalizedRelationAttribute(relation, item.table);
        const relationContext = naming.relationContext(relation, item.table);
        const relationModel = naming.modelClass(relation.on.table);
        if (relation.type === 'has-many') {
          const relationAttribute = naming.relationAttribute(
            relation,
            item.table
          );
          const filterRequest = `Filter${relationModel}Request`;
          imports[`${requestNamespace}\\${filterRequest}`] = true;
          hasManyRelations.push({
            label,
            capitalizedRelationAttribute,
            relationContext,
            filterRequest,
            attribute: relationAttribute,
            model: relationModel,
            references: this.references(relation),
            queryRelations: this.queryRelations(relation, item, itemsByTable),
          });
        } else {
          const createRelationRequest = `Create${relationModel}Request`;
          const attachRelationRequest = `Attach${relationModel}To${model}Request`;
          imports[`${requestNamespace}\\${createRelationRequest}`] = true;
          imports[`${requestNamespace}\\${attachRelationRequest}`] = true;
          imports[`${eloquentNamespace}\\${relationModel}`] = true;
          const references = this.references(relation);
          const attributes = this.relationAttributes(relation, itemsByTable);
          belongsToRelations.push({
            label,
            attributes,
            capitalizedRelationAttribute,
            createRelationRequest,
            attachRelationRequest,
            relationContext,
            model: relationModel,
            references: references,
          });
        }
      }

      imports['Illuminate\\Http\\Request'] = true;

      result.push({
        context,
        namespace,
        model,
        createRequest,
        updateRequest,
        filterRequest,
        hasManyRelations,
        belongsToRelations,
        search: this.searchData(item),
        recordName: naming.recordName(item.table),
        label: naming.singularLabel(item.table),
        attributes: this.attributes(item),
        class: controller,
        imports: Object.keys(imports).sort(),
        queryRelations: queryRelations.length
          ? `'${queryRelations.join("', '")}'`
          : null,
      });
    }

    return result;
  }

  private relationAttributes(
    relation: Relation,
    itemsByTable: Record<string, Item>
  ) {
    const attributes = [];
    const item = itemsByTable[relation.on.table];
    for (const column of item.columns) {
      if (column.autoincrement) {
        continue;
      }
      if (ignoreAttributesFor[column.name]) {
        continue;
      }
      attributes.push({
        name: column.name,
        type: column.type,
      });
    }

    return attributes;
  }

  private attributes(item: Item) {
    const attributes = [];
    for (const column of item.columns) {
      if (column.autoincrement) {
        continue;
      }
      if (ignoreAttributesFor[column.name]) {
        continue;
      }
      attributes.push({
        name: column.name,
        type: column.type,
      });
    }
    return attributes;
  }

  private searchData(item: Item) {
    if (!item.primaryKey || item.primaryKey.columns.length !== 1) {
      return null;
    }
    const key = item.primaryKey.columns[0];
    for (const column of item.columns) {
      if (column.type === 'string') {
        return {
          key,
          attribute: column.name,
        };
      }
    }

    return {
      key,
      attribute: item.columns[0].name,
    };
  }

  private queryRelations(
    currentRelation: Relation,
    item: Item,
    itemsByTable: Record<string, Item>
  ) {
    const queryRelations = [];
    const relatedItem = itemsByTable[currentRelation.on.table];
    for (const relation of relatedItem.relations) {
      if (
        relation.on.table === item.table &&
        relation.columns[0] === currentRelation.references[0]
      ) {
        continue;
      }
      queryRelations.push(
        naming.relationAttribute(relation, relatedItem.table)
      );
    }

    return queryRelations.length ? `'${queryRelations.join("', '")}'` : null;
  }
}
