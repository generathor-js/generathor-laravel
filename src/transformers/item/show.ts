import naming from '../../helpers/naming';
import { BaseTransformer } from './base';

export class Show extends BaseTransformer {
  public transform() {
    const context = naming.context(this.$item.table);
    const fks = this.fks();
    this.$item.laravel.show = {
      layout: this.$config.layout(),
      homeRoute: this.$config.homeRoute(),
      context: context,
      header: naming.listLabel(this.$item.table),
      listLabel: naming.listLabel(this.$item.table),
      recordName: naming.recordName(this.$item.table),
      tabs: this.tabs(context),
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
          nullable: column.nullable,
          label: naming.columnLabel(column),
        };
      }),
    };
  }

  private tabs(context: string) {
    const tabs = [];
    tabs.push({
      label: 'Details',
    });
    for (const relation of this.$item.relations) {
      const relationName = naming.capitalizedRelationAttribute(
        relation,
        this.$item.table
      );
      tabs.push({
        label: naming.relationLabel(relation, this.$item.table),
        route: `generathor.${context}.show${relationName}`,
        routeRecord: naming.recordName(this.$item.table),
      });
    }

    return tabs;
  }
}
