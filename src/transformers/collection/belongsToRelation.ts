import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';
import { Item } from 'generathor-db';

export class BelongsToRelation extends BaseTransformer {
  public transform(): TransformedItem[] {
    const result = [];
    const fksByTable = this.fksByTable();
    const map = this.mapByTable();
    for (const item of this.$items) {
      const context = naming.context(item.table);
      const listLabel = naming.listLabel(item.table);
      const recordName = naming.recordName(item.table);

      for (const relation of item.relations) {
        if (relation.type !== 'belongs-to') {
          continue;
        }
        const relationAttribute = naming.relationAttribute(
          relation,
          item.table
        );
        const relatedItem = map[relation.on.table];
        const fks = fksByTable[relation.on.table];
        result.push({
          context,
          layout: this.$config.layout(),
          homeRoute: this.$config.homeRoute(),
          header: listLabel,
          listLabel: listLabel,
          relationLabel: naming.relationLabel(relation, item.table),
          relationListLabel: naming.listLabel(relation.on.table),
          record: recordName,
          routeRelationRecordName: naming.recordName(relation.on.table),
          capitalizedRelationAttribute: naming.capitalizedRelationAttribute(
            relation,
            item.table
          ),
          relationContext: naming.relationContext(relation, item.table),
          routeRelationContext: naming.context(relation.on.table),
          relationAttribute: relationAttribute,
          columns: relatedItem.columns.map((column) => {
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
          tabs: this.tabs(context, item, recordName, relationAttribute),
        });
      }
    }

    return result;
  }

  private tabs(
    context: string,
    item: Item,
    recordName: string,
    relationAttribute: string
  ) {
    const tabs = [];
    tabs.push({
      label: 'Details',
      route: `generathor.${context}.show`,
      routeRecord: recordName,
    });
    for (const relation of item.relations) {
      const currentRelationAttribute = naming.relationAttribute(
        relation,
        item.table
      );
      const relationLabel = naming.relationLabel(relation, item.table);
      if (currentRelationAttribute === relationAttribute) {
        tabs.push({
          label: relationLabel,
        });
        continue;
      }
      const capitalizedRelationAttribute = naming.capitalizedRelationAttribute(
        relation,
        item.table
      );
      tabs.push({
        label: relationLabel,
        route: `generathor.${context}.show${capitalizedRelationAttribute}`,
        routeRecord: recordName,
      });
    }

    return tabs;
  }
}
