import { Configuration } from '../../configuration';
import { Item, Relation } from 'generathor-db';
import naming from '../../helpers/naming';

export interface CurrentItem extends Item {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [x: string | number | symbol]: any;
}
type FKDetails = {
  relationAttribute: string;
  table: string;
  context: string;
  routeRecordName: string;
};
export abstract class BaseTransformer {
  public constructor(
    protected $item: CurrentItem,
    protected $config: Configuration
  ) {}

  public abstract transform(): void;

  protected fks() {
    const fks: Record<string, FKDetails> = {};
    this.$item.relations.forEach((relation: Relation) => {
      if (relation.type !== 'belongs-to') {
        return;
      }
      const relationColumnKeys: string[] = Object.keys(relation.columns);
      const relationAttribute = naming.relationAttribute(
        relation,
        this.$item.table
      );
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
