import { resolve } from 'path';
import { GeneratorForCollection, GeneratorForItem } from 'generathor';
import { Configuration, ConfigurationAttributes } from './configuration';
import { Laravel } from './transformers/item/laravel';
import { Menu } from './transformers/collection/menu';
import { Route } from './transformers/collection/route';
import { AttachRequest } from './transformers/collection/attachRequest';
import { Controller } from './transformers/collection/controller';
import { AttachForm } from './transformers/collection/attachForm';
import { CreateRelationForm } from './transformers/collection/createRelationForm';
import { FilterRelationForm } from './transformers/collection/filterRelationForm';
import { BaseController } from './transformers/collection/baseController';
import { BelongsToRelation } from './transformers/collection/belongsToRelation';
import { HasManyRelation } from './transformers/collection/hasManyRelation';
import { HandlebarsHelper } from './helpers/handlebars';
import { Item } from 'generathor-db';

type GeneratorType = GeneratorForItem | GeneratorForCollection;
type Templates = Record<string, GeneratorType>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type LaravelItem = Record<string, any>;

export class LaravelGenerator {
  private $configuration: Configuration;

  public constructor(configuration?: ConfigurationAttributes) {
    if (!configuration) {
      configuration = {};
    }
    this.$configuration = new Configuration(configuration);
    HandlebarsHelper.configure();
  }

  private templateKey(key: string) {
    return `${this.$configuration.reference()}-${key}`;
  }

  private templateFile(file: string) {
    return resolve(__dirname, `../templates/${file}.handlebars`);
  }

  private directory(path: string) {
    return this.$configuration.directory() + path;
  }

  public transformer(item: Item) {
    new Laravel(item, this.$configuration).transform();
  }

  public generators() {
    return {
      ...this.generatorsForItems(),
      ...this.generatorsForCollections(),
      ...this.generatorsForStaticFiles(),
    };
  }

  public generatorsForItems() {
    const templates: Templates = {};

    templates[this.templateKey('parent-model')] = new GeneratorForItem({
      template: this.templateFile('eloquent/parent'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Models/Generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.eloquent),
      fileName: (item) => item.model + '.php',
    });

    if (this.$configuration.createChildModel()) {
      templates[this.templateKey('child-model')] = new GeneratorForItem({
        template: this.templateFile('eloquent/child'),
        source: this.$configuration.source(),
        directory: this.directory('/app/Models'),
        prepareItems: (items) =>
          items.map((item: LaravelItem) => item.laravel.eloquent),
        fileName: (item) => item.model + '.php',
      });
    }

    templates[this.templateKey('filter-model')] = new GeneratorForItem({
      template: this.templateFile('eloquent/filter'),
      source: this.$configuration.source(),
      directory: this.directory('/app/ModelFilters'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.filter),
      fileName: (item) => item.class + '.php',
    });

    if (this.$configuration.createEloquentModelsOnly()) {
      return templates;
    }

    templates[this.templateKey('create-request')] = new GeneratorForItem({
      template: this.templateFile('others/request'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Requests/Generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.requests.create),
      fileName: (item) => item.class + '.php',
    });

    templates[this.templateKey('update-request')] = new GeneratorForItem({
      template: this.templateFile('others/request'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Requests/Generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.requests.update),
      fileName: (item) => item.class + '.php',
    });

    templates[this.templateKey('filter-request')] = new GeneratorForItem({
      template: this.templateFile('others/request'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Requests/Generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.requests.filter),
      fileName: (item) => item.class + '.php',
    });

    templates[this.templateKey('attach-request')] = new GeneratorForItem({
      template: this.templateFile('others/request'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Requests/Generathor'),
      prepareItems: (items) =>
        new AttachRequest(items as Item[], this.$configuration).transform(),
      fileName: (item) => item.class + '.php',
    });

    templates[this.templateKey('menu')] = new GeneratorForItem({
      template: this.templateFile('views/menu'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        new Menu(items as Item[], this.$configuration).transform(),
      fileName: () => 'menu.blade.php',
    });

    templates[this.templateKey('base-controller')] = new GeneratorForItem({
      template: this.templateFile('others/base-controller'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Controllers/Generathor'),
      prepareItems: (items) =>
        new BaseController(items as Item[], this.$configuration).transform(),
      fileName: () => 'Controller.php',
    });

    templates[this.templateKey('create-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.forms.create),
      fileName: (item) => item.context + '/create-form.blade.php',
    });

    templates[this.templateKey('filter-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.forms.filter),
      fileName: (item) => item.context + '/filter-form.blade.php',
    });

    templates[this.templateKey('update-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.forms.update),
      fileName: (item) => item.context + '/update-form.blade.php',
    });

    templates[this.templateKey('attach-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        new AttachForm(items as Item[], this.$configuration).transform(),
      fileName: (item) =>
        `${item.context}/attach-${item.contextFile}-form.blade.php`,
    });

    templates[this.templateKey('create-relation-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        new CreateRelationForm(
          items as Item[],
          this.$configuration
        ).transform(),
      fileName: (item) =>
        `${item.context}/create-${item.contextFile}-form.blade.php`,
    });

    templates[this.templateKey('filter-relation-form')] = new GeneratorForItem({
      template: this.templateFile('views/form'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/components/generathor'),
      prepareItems: (items) =>
        new FilterRelationForm(
          items as Item[],
          this.$configuration
        ).transform(),
      fileName: (item) =>
        `${item.context}/filter-${item.contextFile}-form.blade.php`,
    });

    templates[this.templateKey('controller')] = new GeneratorForItem({
      template: this.templateFile('others/controller'),
      source: this.$configuration.source(),
      directory: this.directory('/app/Http/Controllers/Generathor'),
      prepareItems: (items) =>
        new Controller(items as Item[], this.$configuration).transform(),
      fileName: (item) => item.class + '.php',
    });

    templates[this.templateKey('index-view')] = new GeneratorForItem({
      template: this.templateFile('views/index'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.list),
      fileName: (item) => item.context + '/index.blade.php',
    });

    templates[this.templateKey('edit-view')] = new GeneratorForItem({
      template: this.templateFile('views/edit'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.edit),
      fileName: (item) => item.context + '/edit.blade.php',
    });

    templates[this.templateKey('show-view')] = new GeneratorForItem({
      template: this.templateFile('views/show'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        items.map((item: LaravelItem) => item.laravel.show),
      fileName: (item) => item.context + '/show.blade.php',
    });

    templates[this.templateKey('relation-item-view')] = new GeneratorForItem({
      template: this.templateFile('views/relation-item'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        new BelongsToRelation(items as Item[], this.$configuration).transform(),
      fileName: (item) => `${item.context}/${item.relationContext}.blade.php`,
    });

    templates[this.templateKey('relation-list-view')] = new GeneratorForItem({
      template: this.templateFile('views/relation-list'),
      source: this.$configuration.source(),
      directory: this.directory('/resources/views/generathor'),
      prepareItems: (items) =>
        new HasManyRelation(items as Item[], this.$configuration).transform(),
      fileName: (item) => `${item.context}/${item.relationContext}.blade.php`,
    });

    return templates;
  }

  public generatorsForCollections() {
    if (this.$configuration.createEloquentModelsOnly()) {
      return {};
    }
    const templates: Templates = {};

    templates[this.templateKey('routes')] = new GeneratorForCollection({
      template: this.templateFile('others/routes'),
      source: this.$configuration.source(),
      file: this.directory('/routes/generathor.php'),
      prepareItems: (items) =>
        new Route(items as Item[], this.$configuration).transform(),
    });

    return templates;
  }

  public generatorsForStaticFiles() {
    const templates: Templates = {};

    templates[this.templateKey('pk-trait')] = new GeneratorForCollection({
      template: this.templateFile('others/pk-trait'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory('/app/Models/Generathor/GenerathorKey.php'),
    });

    if (this.$configuration.createEloquentModelsOnly()) {
      return templates;
    }

    templates[this.templateKey('record-input')] = new GeneratorForCollection({
      template: this.templateFile('views/record-input'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory(
        '/resources/views/components/generathor/record-input.blade.php'
      ),
    });

    templates[this.templateKey('breadcrumbs')] = new GeneratorForCollection({
      template: this.templateFile('views/breadcrumbs'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory(
        '/resources/views/components/generathor/breadcrumbs.blade.php'
      ),
    });

    templates[this.templateKey('tabs')] = new GeneratorForCollection({
      template: this.templateFile('views/tabs'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory(
        '/resources/views/components/generathor/tabs.blade.php'
      ),
    });

    templates[this.templateKey('modal')] = new GeneratorForCollection({
      template: this.templateFile('views/modal'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory(
        '/resources/views/components/generathor/modal.blade.php'
      ),
    });

    templates[this.templateKey('loader')] = new GeneratorForCollection({
      template: this.templateFile('views/loader'),
      source: this.$configuration.source(),
      prepareItems: () => [],
      file: this.directory(
        '/resources/views/components/generathor/loader.blade.php'
      ),
    });

    const icons = [
      'check-circle',
      'chevron-right',
      'computer',
      'eye',
      'funnel',
      'home',
      'pencil',
      'plus',
      'trash',
      'x-circle',
      'x',
      'chevron-down',
      'list-bullet',
      'link',
      'unlink',
    ];

    for (const icon of icons) {
      templates[this.templateKey(`icon-${icon}`)] = new GeneratorForCollection({
        template: this.templateFile('views/icons/' + icon),
        source: this.$configuration.source(),
        prepareItems: () => [],
        file: this.directory(
          `/resources/views/components/generathor/icon-${icon}.blade.php`
        ),
      });
    }

    return templates;
  }
}
