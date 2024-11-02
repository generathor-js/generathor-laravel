import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';

type Input = {
  type: string;
  name: string;
  label: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data?: Record<string, any>;
};
export class AttachForm extends BaseTransformer {
  public transform(): TransformedItem[] {
    const map = this.mapByTable();
    const result = [];
    for (const item of this.$items) {
      const context = naming.context(item.table);
      for (const relation of item.relations) {
        if (relation.type !== 'belongs-to') {
          continue;
        }
        const itemRelated = map[relation.on.table];
        const inputs: Input[] = [];
        relation.columns.forEach((column) => {
          inputs.push({
            type: 'record',
            name: column,
            label: naming.label(column),
            data: {
              context: naming.context(itemRelated.table),
              relationName: naming.relationAttribute(
                relation,
                itemRelated.table
              ),
            },
          });
        });
        const relationLabel = naming.capitalizedRelationAttribute(
          relation,
          itemRelated.table
        );

        result.push({
          context,
          contextFile: naming.relationContext(relation, item.table),
          record: null,
          routeRecord: naming.recordName(item.table),
          method: 'post',
          prefix: '',
          getOld: 'old',
          errorBag: 'attach',
          buttonLabel: 'Save',
          buttonColor: 'green',
          columns: '2',
          route: `generathor.${context}.attach${relationLabel}`,
          cancelLink: null,
          inputs: inputs,
          hiddenInputs: [],
        });
      }
    }
    return result;
  }
}
