import { Column, Relation } from 'generathor-db';
import str from './string';

class Naming {
  public relationAttribute(relation: Relation, table: string) {
    if (relation.columns.length !== 1) {
      return relation.type === 'has-many'
        ? str.fromSnakeToPluralCamel(relation.on.table)
        : str.fromSnakeToSingularCamel(relation.on.table);
    }
    if (relation.type !== 'has-many') {
      return str.fromSnakeToSingularCamel(
        relation.columns[0].replace(/_id$/, '')
      );
    }

    //Has many relationship
    const fk = relation.references[0].replace(/_id$/, '');
    if (
      table === str.fromSnakeToSingularSnake(fk) ||
      table === str.fromSnakeToPluralSnake(fk)
    ) {
      return str.fromSnakeToPluralCamel(relation.on.table);
    }

    return (
      str.fromSnakeToPluralCamel(relation.on.table) +
      'As' +
      str.fromSnakeToSingularPascal(fk)
    );
  }

  public capitalizedRelationAttribute(relation: Relation, table: string) {
    return str.capitalize(this.relationAttribute(relation, table));
  }

  public modelClass(table: string) {
    const name = str.fromSnakeToSingularPascal(table);

    return name === 'Class' ? name + 'Model' : name;
  }

  public controller(table: string) {
    return str.fromSnakeToSingularPascal(table) + 'Controller';
  }

  public columnAttribute(column: Column) {
    return str.fromSnakeToCamel(column.name);
  }

  public columnLabel(column: Column) {
    return this.label(column.name);
  }

  public label(text: string) {
    return str.fromSnakeToLabel(text.replace(/_id$/, ''));
  }

  public singularLabel(text: string) {
    return str.fromSnakeToSingularLabel(text);
  }

  public context(table: string) {
    return str.fromSnakeToKebab(table);
  }

  public relationContext(relation: Relation, table: string) {
    if (relation.columns.length !== 1) {
      return relation.type === 'has-many'
        ? str.fromSnakeToPluralKebab(relation.on.table)
        : str.fromSnakeToSingularKebab(relation.on.table);
    }
    if (relation.type !== 'has-many') {
      return str.fromSnakeToSingularKebab(
        relation.columns[0].replace(/_id$/, '')
      );
    }

    //Has many relationship
    const fk = relation.references[0].replace(/_id$/, '');
    if (
      table === str.fromSnakeToSingularSnake(fk) ||
      table === str.fromSnakeToPluralSnake(fk)
    ) {
      return str.fromSnakeToPluralKebab(relation.on.table);
    }

    return (
      str.fromSnakeToPluralKebab(relation.on.table) +
      '-as-' +
      str.fromSnakeToSingularKebab(fk)
    );
  }

  public relationLabel(relation: Relation, table: string) {
    if (relation.columns.length !== 1) {
      return relation.type === 'has-many'
        ? str.fromSnakeToPluralLabel(relation.on.table)
        : str.fromSnakeToSingularLabel(relation.on.table);
    }
    if (relation.type !== 'has-many') {
      return str.fromSnakeToSingularLabel(
        relation.columns[0].replace(/_id$/, '')
      );
    }

    //Has many relationship
    const fk = relation.references[0].replace(/_id$/, '');
    if (
      table === str.fromSnakeToSingularSnake(fk) ||
      table === str.fromSnakeToPluralSnake(fk)
    ) {
      return str.fromSnakeToPluralLabel(relation.on.table);
    }

    return (
      str.fromSnakeToPluralLabel(relation.on.table) +
      ' as ' +
      str.fromSnakeToSingularLabel(fk).toLowerCase()
    );
  }

  public listLabel(table: string) {
    return str.fromSnakeToPluralLabel(table);
  }

  public recordName(table: string) {
    const recordName = str.fromSnakeToSingularCamel(table);

    return recordName.length > 32 ? 'record' : recordName;
  }
}

export default new Naming();
