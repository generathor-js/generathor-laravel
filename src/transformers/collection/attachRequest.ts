import { BaseTransformer, TransformedItem } from './base';
import * as th from '../../helpers/type';
import naming from '../../helpers/naming';
import { Column, Item } from 'generathor-db';

const ignoreCreateRulesFor: Record<string, boolean> = {
  created_at: true,
  updated_at: true,
};

type Rule = {
  attribute: string;
  rules: string;
};

export class AttachRequest extends BaseTransformer {
  public transform(): TransformedItem[] {
    const result = [];
    for (const item of this.$items) {
      const model = naming.modelClass(item.table);
      const columnRules = this.columnRules(item);
      for (const relation of item.relations) {
        if (relation.type !== 'belongs-to') {
          continue;
        }
        const relatedModel = naming.capitalizedRelationAttribute(
          relation,
          item.table
        );
        const rules: Rule[] = [];
        relation.columns.forEach((columnName) => {
          rules.push({
            attribute: columnName,
            rules: columnRules[columnName],
          });
        });
        result.push({
          namespace: 'App\\Http\\Requests\\Generathor',
          class: `Attach${relatedModel}To${model}Request`,
          rules: rules,
          errorBag: 'attach',
        });
      }
    }

    return result;
  }

  private columnRules(item: Item) {
    const columnRules: Record<string, string> = {};
    item.columns.forEach((column: Column) => {
      const rules = ['required'];
      if (
        column.type === 'string' &&
        column.enum &&
        Array.isArray(column.enum)
      ) {
        const rule = 'in:' + column.enum.join(',');
        rules.push(rule);
      }
      const ruleType = th.ruleType(column);
      if (column.type !== 'date') {
        rules.push(ruleType);
      }

      const dateRuleType = th.dateRuleType(column);
      if (column.type === 'date' && dateRuleType) {
        rules.push(dateRuleType);
      }

      if (!column.autoincrement) {
        if (!ignoreCreateRulesFor[column.name]) {
          columnRules[column.name] = rules.join('|');
        }
      }
    });
    return columnRules;
  }
}
