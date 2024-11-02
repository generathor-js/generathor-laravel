import { Configuration } from '../../configuration';
import { Eloquent } from './eloquent';
import { Forms } from './forms';
import { Filter } from './filter';
import { Requests } from './requests';
import { BaseTransformer, CurrentItem } from './base';
import { List } from './list';
import { Edit } from './edit';
import { Show } from './show';

export class Laravel extends BaseTransformer {
  private $eloquent: Eloquent;
  private $forms: Forms;
  private $filter: Filter;
  private $requests: Requests;
  private $list: List;
  private $edit: Edit;
  private $show: Show;

  public constructor(
    protected $item: CurrentItem,
    protected $config: Configuration
  ) {
    super($item, $config);
    this.$eloquent = new Eloquent($item, $config);
    this.$forms = new Forms($item, $config);
    this.$filter = new Filter($item, $config);
    this.$requests = new Requests($item, $config);
    this.$list = new List($item, $config);
    this.$edit = new Edit($item, $config);
    this.$show = new Show($item, $config);
  }

  public transform() {
    this.$item.laravel = {};
    this.$eloquent.transform();
    this.$forms.transform();
    this.$filter.transform();
    this.$requests.transform();
    this.$list.transform();
    this.$edit.transform();
    this.$show.transform();
  }
}
