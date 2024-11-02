import naming from '../../helpers/naming';
import * as th from '../../helpers/type';
import { BaseTransformer } from './base';

const ignoreCreateRulesFor: Record<string, boolean> = {
  created_at: true,
  updated_at: true,
};

type Rule = {
  attribute: string;
  rules: string;
};
type RequestDetail = {
  namespace: string;
  class: string;
  rules: Rule[];
  errorBag: string;
};

export class Requests extends BaseTransformer {
  public transform() {
    const model = naming.modelClass(this.$item.table);
    const result: Record<string, RequestDetail> = {
      create: {
        namespace: 'App\\Http\\Requests\\Generathor',
        class: `Create${model}Request`,
        rules: [],
        errorBag: 'create',
      },
      update: {
        namespace: 'App\\Http\\Requests\\Generathor',
        class: `Update${model}Request`,
        rules: [],
        errorBag: 'update',
      },
      filter: {
        namespace: 'App\\Http\\Requests\\Generathor',
        class: `Filter${model}Request`,
        rules: [],
        errorBag: 'filter',
      },
    };
    const fks = this.fks();
    this.$item.columns.forEach((column) => {
      const rules = [];
      const filterRules = [];
      if (!column.nullable && column.type !== 'bool') {
        rules.push('required');
      } else {
        rules.push('nullable');
      }
      filterRules.push('nullable');
      if (
        column.type === 'string' &&
        column.enum &&
        Array.isArray(column.enum)
      ) {
        const rule = 'in:' + column.enum.join(',');
        rules.push(rule);
        filterRules.push(rule);
      }
      const ruleType = th.ruleType(column);
      if (column.type !== 'date') {
        rules.push(ruleType);
        filterRules.push(ruleType);
      }

      const dateRuleType = th.dateRuleType(column);
      if (column.type === 'date' && dateRuleType) {
        rules.push(dateRuleType);
        filterRules.push(dateRuleType);
      }
      if (!column.autoincrement) {
        if (!ignoreCreateRulesFor[column.name]) {
          result.create.rules.push({
            attribute: column.name,
            rules: rules.join('|'),
          });
          result.update.rules.push({
            attribute: column.name,
            rules: rules.join('|'),
          });
        }
        const createRange =
          column.type === 'date' ||
          (!fks[column.name] &&
            (column.type === 'int' || column.type === 'float'));
        if (createRange) {
          const fromInput = column.name + '_from';
          const toInput = column.name + '_to';
          result.filter.rules.push({
            attribute: fromInput,
            rules: filterRules.join('|'),
          });
          result.filter.rules.push({
            attribute: toInput,
            rules: filterRules.join('|'),
          });
        } else {
          result.filter.rules.push({
            attribute: column.name,
            rules: filterRules.join('|'),
          });
        }
      }
    });

    this.$item.laravel.requests = result;
  }
}
