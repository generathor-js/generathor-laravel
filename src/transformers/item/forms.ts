import naming from '../../helpers/naming';
import { BaseTransformer } from './base';

const ignoreInputsFor: Record<string, boolean> = {
  created_at: true,
  updated_at: true,
};
type FormDetail = {
  context: string;
  record: string | null;
  routeRecord: string | null;
  method: string;
  prefix: string;
  getOld: string;
  errorBag: string;
  buttonLabel: string;
  buttonColor: string;
  columns: string;
  route?: string;
  cancelLink: CancelLink | null;
  inputs: Input[];
  hiddenInputs: HiddenInput[];
};
type CancelLink = {
  label: string;
  route: string;
  icon: string | null;
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
};

export class Forms extends BaseTransformer {
  public transform() {
    const context = naming.context(this.$item.table);
    const recordName = naming.recordName(this.$item.table);
    const result: Record<string, FormDetail> = {
      create: {
        context,
        record: null,
        routeRecord: null,
        method: 'post',
        prefix: '',
        getOld: 'old',
        errorBag: 'create',
        buttonLabel: 'Save',
        buttonColor: 'green',
        columns: '2',
        route: `generathor.${context}.store`,
        cancelLink: null,
        inputs: [] as Input[],
        hiddenInputs: [],
      },
      update: {
        context,
        record: recordName,
        routeRecord: recordName,
        method: 'put',
        prefix: '',
        getOld: 'old',
        errorBag: 'update',
        buttonLabel: 'Save',
        buttonColor: 'green',
        columns: '2',
        route: `generathor.${context}.update`,
        cancelLink: {
          label: 'Cancel',
          route: `request()->query('_url', route('generathor.${context}.show', ['${recordName}' => $${recordName}->getRouteKey()]))`,
          icon: null,
        },
        inputs: [] as Input[],
        hiddenInputs: [
          {
            name: '_url',
            type: 'query',
          },
        ],
      },
      filter: {
        context,
        record: null,
        routeRecord: null,
        method: 'get',
        prefix: 'filter_',
        getOld: 'request',
        errorBag: 'filter',
        buttonLabel: 'Filter',
        buttonColor: 'blue',
        columns: '4',
        cancelLink: {
          label: 'Clear filters',
          route: 'request()->url()',
          icon: '<x-generathor.icon-x />',
        },
        inputs: [] as Input[],
        hiddenInputs: [],
      },
    };
    const fks = this.fks();
    this.$item.columns.forEach((column) => {
      if (column.autoincrement) {
        return;
      }
      if (fks[column.name]) {
        const input = {
          type: 'record',
          name: column.name,
          label: naming.columnLabel(column),
          data: {
            context: naming.context(fks[column.name].table),
            relationName: fks[column.name].relationAttribute,
          },
        };
        result.create.inputs.push(input);
        result.update.inputs.push(input);
        result.filter.inputs.push(input);
        return;
      }
      if (
        column.type === 'string' &&
        column.enum &&
        Array.isArray(column.enum) &&
        column.enum.length > 0
      ) {
        const input = {
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
        };
        result.create.inputs.push(input);
        result.update.inputs.push(input);
        result.filter.inputs.push(input);
        return;
      }
      if (column.type === 'int' || column.type === 'float') {
        const decimals = column.type === 'int' ? 0 : column.scale;
        const input = {
          type: 'number',
          name: column.name,
          label: naming.columnLabel(column),
          data: {
            decimals,
          },
        };
        result.create.inputs.push(input);
        result.update.inputs.push(input);
        result.filter.inputs.push({
          type: 'number',
          name: column.name + '_from',
          label: naming.label(column.name + '_from'),
          data: {
            decimals,
          },
        });
        result.filter.inputs.push({
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
        const input = {
          type: 'checkbox',
          name: column.name,
          label: naming.columnLabel(column),
        };
        result.create.inputs.push(input);
        result.update.inputs.push(input);
        result.filter.inputs.push({
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
        if (!ignoreInputsFor[column.name]) {
          const input = {
            type: column.subType as string,
            name: column.name,
            label: naming.columnLabel(column),
          };
          result.create.inputs.push(input);
          result.update.inputs.push(input);
        }

        result.filter.inputs.push({
          type: column.subType as string,
          name: column.name + '_from',
          label: naming.label(column.name + '_from'),
        });
        result.filter.inputs.push({
          type: column.subType as string,
          name: column.name + '_to',
          label: naming.label(column.name + '_to'),
        });
        return;
      }

      const input = {
        type: 'text',
        name: column.name,
        label: naming.columnLabel(column),
      };
      result.create.inputs.push(input);
      result.update.inputs.push(input);
      result.filter.inputs.push(input);
    });

    this.$item.laravel.forms = result;
  }
}
