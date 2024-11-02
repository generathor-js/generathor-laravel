import naming from '../../helpers/naming';
import { BaseTransformer } from './base';

export class List extends BaseTransformer {
  public transform() {
    const fks = this.fks();
    this.$item.laravel.list = {
      layout: this.$config.layout(),
      homeRoute: this.$config.homeRoute(),
      context: naming.context(this.$item.table),
      header: naming.listLabel(this.$item.table),
      recordName: naming.recordName(this.$item.table),
      columns: this.$item.columns.map((column) => {
        let type = column.type;
        let data = null;
        if (fks[column.name]) {
          type = 'record';
          data = fks[column.name];
        }
        return {
          data,
          type,
          name: column.name,
          label: naming.columnLabel(column),
          nullable: column.nullable,
        };
      }),
    };
  }
}
