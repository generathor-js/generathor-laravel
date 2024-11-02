import { BaseTransformer, TransformedItem } from './base';
import naming from '../../helpers/naming';

export class Menu extends BaseTransformer {
  public transform(): TransformedItem[] {
    return [
      {
        layout: this.$config.layout(),
        homeRoute: this.$config.homeRoute(),
        items: this.$items.map((item) => {
          return {
            context: naming.context(item.table),
            label: naming.listLabel(item.table),
          };
        }),
      },
    ];
  }
}
