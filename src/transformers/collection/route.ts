import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';

export class Route extends BaseTransformer {
  public transform(): TransformedItem[] {
    const result = [];
    for (const item of this.$items) {
      const routes = [];
      const context = naming.context(item.table);
      const controller = this.controller(item.table);
      routes.push({
        context,
        method: 'get',
        path: context,
        action: 'index',
        precognition: true,
      });
      routes.push({
        context,
        method: 'post',
        path: context,
        action: 'store',
        precognition: true,
      });

      if (item.primaryKey && item.primaryKey.columns.length === 1) {
        routes.push({
          context,
          method: 'get',
          path: `${context}/search`,
          action: 'search',
          precognition: false,
        });
      }
      const recordName = naming.recordName(item.table);
      routes.push({
        context,
        method: 'get',
        path: `${context}/{${recordName}}`,
        action: 'show',
        precognition: false,
      });
      routes.push({
        context,
        method: 'get',
        path: `${context}/{${recordName}}/edit`,
        action: 'edit',
        precognition: false,
      });
      routes.push({
        context,
        method: 'put',
        path: `${context}/{${recordName}}`,
        action: 'update',
        precognition: true,
      });
      routes.push({
        context,
        method: 'delete',
        path: `${context}/{${recordName}}`,
        action: 'destroy',
        precognition: false,
      });

      for (const relation of item.relations) {
        const relationContext = naming.relationContext(relation, item.table);
        const relationName = naming.capitalizedRelationAttribute(
          relation,
          item.table
        );

        if (relation.type === 'has-many') {
          routes.push({
            context,
            method: 'get',
            path: `${context}/{${recordName}}/${relationContext}`,
            action: 'show' + relationName,
            precognition: true,
          });
        } else {
          routes.push({
            context,
            method: 'get',
            path: `${context}/{${recordName}}/${relationContext}`,
            action: 'show' + relationName,
            precognition: false,
          });
          routes.push({
            context,
            method: 'post',
            path: `${context}/{${recordName}}/${relationContext}`,
            action: 'store' + relationName,
            precognition: true,
          });
          routes.push({
            context,
            method: 'post',
            path: `${context}/{${recordName}}/${relationContext}/attach`,
            action: 'attach' + relationName,
            precognition: true,
          });
          routes.push({
            context,
            method: 'post',
            path: `${context}/{${recordName}}/${relationContext}/detach`,
            action: 'detach' + relationName,
            precognition: true,
          });
        }
      }
      result.push({
        controller,
        label: naming.listLabel(item.table),
        routes,
      });
    }

    return result;
  }

  private controller(table: string) {
    return 'App\\Http\\Controllers\\Generathor\\' + naming.controller(table);
  }
}
