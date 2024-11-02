import { Configuration } from '../../configuration';
import { Item, Relation } from 'generathor-db';
import naming from '../../helpers/naming';

type FKDetails = {
  relationAttribute: string;
  table: string;
  context: string;
  routeRecordName: string;
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type TransformedItem = Record<string, any>;
export abstract class BaseTransformer {
  public constructor(
    protected $items: Item[],
    protected $config: Configuration
  ) {}

  public abstract transform(): TransformedItem[];

  protected mapByTable() {
    const map: Record<string, Item> = {};
    for (const item of this.$items) {
      map[item.table] = item;
    }

    return map;
  }

  protected references(relation: Relation) {
    const references: Record<string, string> = {};
    for (const index in relation.references) {
      references[relation.references[index]] = relation.columns[index];
    }
    return references;
  }

  protected fksByTable() {
    const map: Record<string, Record<string, FKDetails>> = {};
    for (const item of this.$items) {
      map[item.table] = this.fks(item);
    }

    return map;
  }

  private fks(item: Item) {
    const fks: Record<string, FKDetails> = {};
    item.relations.forEach((relation) => {
      if (relation.type !== 'belongs-to') {
        return;
      }
      const relationColumnKeys = Object.keys(relation.columns);
      const relationAttribute = naming.relationAttribute(relation, item.table);
      if (relationColumnKeys.length === 1) {
        fks[relation.columns[0]] = {
          relationAttribute,
          table: relation.on.table,
          context: naming.context(relation.on.table),
          routeRecordName: naming.recordName(relation.on.table),
        };
      }
    });

    return fks;
  }
}
