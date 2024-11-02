import naming from '../../helpers/naming';
import { BaseTransformer } from './base';

export class Edit extends BaseTransformer {
  public transform() {
    this.$item.laravel.edit = {
      layout: this.$config.layout(),
      homeRoute: this.$config.homeRoute(),
      context: naming.context(this.$item.table),
      header: naming.listLabel(this.$item.table),
      listLabel: naming.listLabel(this.$item.table),
      recordName: naming.recordName(this.$item.table),
    };
  }
}
