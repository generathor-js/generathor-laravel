import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';

type HiddenInput = {
  name: string;
  type: string;
};

type Input = {
  type: string;
  name: string;
  label: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data?: Record<string, any>;
};

export class FilterRelationForm extends BaseTransformer {
  public transform(): TransformedItem[] {
    const map = this.mapByTable();
    const result = [];
    const fksMap = this.fksByTable();
    for (const item of this.$items) {
      const context = naming.context(item.table);

      for (const relation of item.relations) {
        if (relation.type !== 'has-many') {
          continue;
        }
        const itemRelated = map[relation.on.table];
        const inputs: Input[] = [];
        const hiddenInputs: HiddenInput[] = [];
        const references = this.references(relation);

        const fks = fksMap[itemRelated.table];
        itemRelated.columns.forEach((column) => {
          if (references[column.name]) {
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
          if (column.type === 'int' || column.type === 'float') {
            const decimals = column.type === 'int' ? 0 : column.scale;
            inputs.push({
              type: 'number',
              name: column.name + '_from',
              label: naming.label(column.name + '_from'),
              data: {
                decimals,
              },
            });
            inputs.push({
              type: 'number',
              name: column.name + '_to',
              label: naming.label(column.name + '_to'),
              data: {
                decimals,
              },
            });
            return;
          }
          if (column.type === 'bool') {
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
                  {
                    value: '0',
                    label: 'No',
                  },
                  {
                    value: '1',
                    label: 'Yes',
                  },
                ],
              },
            });
            return;
          }
          const dates: Record<string, boolean> = {
            datetime: true,
            time: true,
            date: true,
          };
          if (dates[column.subType as string]) {
            inputs.push({
              type: column.subType as string,
              name: column.name + '_from',
              label: naming.label(column.name + '_from'),
            });
            inputs.push({
              type: column.subType as string,
              name: column.name + '_to',
              label: naming.label(column.name + '_to'),
            });
            return;
          }
          inputs.push({
            type: 'text',
            name: column.name,
            label: naming.columnLabel(column),
          });
        });

        result.push({
          context,
          contextFile: naming.relationContext(relation, item.table),
          record: null,
          routeRecord: null,
          method: 'get',
          prefix: 'filter_',
          getOld: 'request',
          errorBag: 'filter',
          buttonLabel: 'Filter',
          buttonColor: 'blue',
          columns: '4',
          route: '',
          cancelLink: {
            label: 'Clear filters',
            route: 'request()->url()',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>`,
          },
          inputs: inputs,
          hiddenInputs: hiddenInputs,
        });
      }
    }
    return result;
  }
}
