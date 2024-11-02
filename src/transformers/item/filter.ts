import { Column } from 'generathor-db';
import naming from '../../helpers/naming';
import { BaseTransformer } from './base';

export class Filter extends BaseTransformer {
  public transform() {
    const fks = this.fks();
    const pkMap = this.pkMap();
    this.$item.laravel.filter = {
      class: naming.modelClass(this.$item.table) + 'Filter',
      namespace: 'App\\ModelFilters',
      columns: this.$item.columns.map((column: Column) => {
        let type = column.type;
        if (pkMap[column.name]) {
          type = 'key';
        } else if (fks[column.name]) {
          type = 'record';
        }

        return {
          type,
          name: column.name,
          attribute: naming.columnAttribute(column),
        };
      }),
    };
  }

  private pkMap() {
    const pkMap: Record<string, boolean> = {};
    const columns = this.$item.primaryKey ? this.$item.primaryKey.columns : [];
    for (const column of columns) {
      pkMap[column] = true;
    }

    return pkMap;
  }
}
