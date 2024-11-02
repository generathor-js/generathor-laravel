import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';
const ignoreInputsFor: Record<string, boolean> = {
  created_at: true,
  updated_at: true,
};
type Input = {
  type: string;
  name: string;
  label: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data?: Record<string, any>;
};

type HiddenInput = {
  name: string;
  type: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data?: Record<string, any>;
};

export class CreateRelationForm extends BaseTransformer {
  public transform(): TransformedItem[] {
    const map = this.mapByTable();
    const result = [];
    const fksMap = this.fksByTable();
    for (const item of this.$items) {
      const context = naming.context(item.table);

      for (const relation of item.relations) {
        const isHasMayRelation = relation.type === 'has-many';
        const itemRelated = map[relation.on.table];
        const inputs: Input[] = [];
        const hiddenInputs: HiddenInput[] = [];
        const references = this.references(relation);

        const fks = fksMap[itemRelated.table];
        const recordName = naming.recordName(item.table);
        itemRelated.columns.forEach((column) => {
          if (references[column.name]) {
            if (isHasMayRelation) {
              hiddenInputs.push({
                name: column.name,
                type: 'fixed',
                data: {
                  value: `$${recordName}->${references[column.name]}`,
                },
              });
            }

            return;
          }
          if (column.autoincrement) {
            return;
          }
          if (fks[column.name]) {
            inputs.push({
              type: 'record',
              name: column.name,
              label: naming.columnLabel(column),
              data: {
                context: naming.context(fks[column.name].table),
                relationName: fks[column.name].relationAttribute,
              },
            });
            return;
          }
          if (
            column.type === 'string' &&
            column.enum &&
            Array.isArray(column.enum) &&
            column.enum.length > 0
          ) {
            inputs.push({
              type: 'select',
              name: column.name,
              label: naming.columnLabel(column),
              data: {
                options: [
                  {
                    value: '',
                    label: 'Select',
                  },
                ].concat(
                  column.enum.map(function (value) {
                    return {
                      value: value,
                      label: naming.label(value),
                    };
                  })
                ),
              },
            });
            return;
          }
          if (column.type === 'int') {
            inputs.push({
              type: 'number',
              name: column.name,
              label: naming.columnLabel(column),
              data: {
                decimals: 0,
              },
            });
            return;
          }
          if (column.type === 'float') {
            inputs.push({
              type: 'number',
              name: column.name,
              label: naming.columnLabel(column),
              data: {
                decimals: column.scale,
              },
            });
            return;
          }
          if (column.type === 'bool') {
            inputs.push({
              type: 'checkbox',
              name: column.name,
              label: naming.columnLabel(column),
            });
            return;
          }
          const dates: Record<string, boolean> = {
            datetime: true,
            time: true,
            date: true,
          };
          if (dates[column.subType as string]) {
            if (!ignoreInputsFor[column.name]) {
              inputs.push({
                type: column.subType as string,
                name: column.name,
                label: naming.columnLabel(column),
              });
            }
            return;
          }
          inputs.push({
            type: 'text',
            name: column.name,
            label: naming.columnLabel(column),
          });
        });
        const relationRouteContext = naming.context(itemRelated.table);
        const parentContext = naming.context(item.table);
        if (isHasMayRelation) {
          hiddenInputs.push({
            name: '_url',
            type: 'current_url',
          });
        }
        result.push({
          context,
          contextFile: naming.relationContext(relation, item.table),
          record: null,
          routeRecord: isHasMayRelation ? null : recordName,
          method: 'post',
          prefix: '',
          getOld: 'old',
          errorBag: 'create',
          buttonLabel: 'Save',
          buttonColor: 'green',
          columns: '2',
          route: isHasMayRelation
            ? `generathor.${relationRouteContext}.store`
            : `generathor.${parentContext}.store${naming.capitalizedRelationAttribute(relation, item.table)}`,
          cancelLink: null,
          inputs: inputs,
          hiddenInputs: hiddenInputs,
        });
      }
    }
    return result;
  }
}
