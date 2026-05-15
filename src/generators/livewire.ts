import { GeneratorForCollection, GeneratorForItem, type Item } from 'generathor';
import type { Item as DBItem, Relation } from 'generathor-db';
import naming from '../helpers/naming.js';
import { BaseGeneratorProvider, type LaravelItem } from './base.js';
import type { GeneratorType } from './contracts.js';

export class LivewireGeneratorProvider extends BaseGeneratorProvider {
	public getGenerators(): Record<string, GeneratorType> {
		return {
			...this.components(),
			...this.views(),
		};
	}

	public components(): Record<string, GeneratorType> {
		const templates: Record<string, GeneratorType> = {};

		templates[this.templateKey('disclosure-trigger-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/disclosure-trigger'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/resources/views/components/generathor/disclosure/trigger.blade.php'),
		});

		templates[this.templateKey('disclosure-content-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/disclosure-content'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/resources/views/components/generathor/disclosure/content.blade.php'),
		});

		templates[this.templateKey('record-select-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/record-select'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/resources/views/components/generathor/record-select.blade.php'),
		});

		templates[this.templateKey('list-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/list'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/ListComponent.php'),
		});

		templates[this.templateKey('related-list-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/related-list'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/RelatedListComponent.php'),
		});

		templates[this.templateKey('related-view-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/related-view'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/RelatedViewComponent.php'),
		});

		templates[this.templateKey('view-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/view'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/ViewComponent.php'),
		});

		templates[this.templateKey('edit-component')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/edit'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/EditFormComponent.php'),
		});

		templates[this.templateKey('with-filterable-list-trait')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/with-filterable-list'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/WithFilterableList.php'),
		});

		templates[this.templateKey('with-messages-trait')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/with-messages'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/WithMessages.php'),
		});

		templates[this.templateKey('with-error-handler-trait')] = new GeneratorForCollection({
			template: this.templateFile('livewire/components/with-error-handler'),
			source: this.configuration.source(),
			prepareItems: () => [],
			overwriteFiles: this.overwriteFiles(),
			file: this.directory('/app/Livewire/Generathor/Components/WithErrorHandler.php'),
		});

		return templates;
	}

	public views(): Record<string, GeneratorType> {
		const templates: Record<string, GeneratorType> = {};

		templates[this.templateKey('routes')] = new GeneratorForCollection({
			template: this.templateFile('livewire/routes'),
			source: this.configuration.source(),
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
			file: this.directory('/routes/generathor.php'),
		});

		templates[this.templateKey('view-menu')] = new GeneratorForCollection({
			template: this.templateFile('livewire/view-menu'),
			source: this.configuration.source(),
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
			file: this.directory('/resources/views/pages/generathor/menu.blade.php'),
		});

		templates[this.templateKey('view-list')] = new GeneratorForItem({
			template: this.templateFile('livewire/view-list'),
			source: this.configuration.source(),
			directory: this.directory('/resources/views/pages/generathor'),
			fileName: (item: Item) =>
				`${naming.context((item as LaravelItem).definition.table)}/index.blade.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('view-item')] = new GeneratorForItem({
			template: this.templateFile('livewire/view-item'),
			source: this.configuration.source(),
			directory: this.directory('/resources/views/pages/generathor'),
			fileName: (item: Item) =>
				`${naming.context((item as LaravelItem).definition.table)}/show.blade.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('view-edit')] = new GeneratorForItem({
			template: this.templateFile('livewire/view-edit'),
			source: this.configuration.source(),
			directory: this.directory('/resources/views/pages/generathor'),
			fileName: (item: Item) =>
				`${naming.context((item as LaravelItem).definition.table)}/edit.blade.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('view-relation-has-many')] = new GeneratorForItem({
			template: this.templateFile('livewire/view-relation-has-many'),
			source: this.configuration.source(),
			directory: this.directory('/resources/views/pages/generathor'),
			fileName: (item: Item) => {
				const i = item as LaravelItem;
				return `${naming.context(i.definition.table)}/${naming.relationContext(i.relation as Relation, i.definition.table)}.blade.php`;
			},
			prepareItems: this.hasManyRelationsFromItems.bind(this),
		});

		templates[this.templateKey('view-relation-belongs-to')] = new GeneratorForItem({
			template: this.templateFile('livewire/view-relation-belongs-to'),
			source: this.configuration.source(),
			directory: this.directory('/resources/views/pages/generathor'),
			fileName: (item: Item) => {
				const i = item as LaravelItem;
				return `${naming.context(i.definition.table)}/${naming.relationContext(i.relation as Relation, i.definition.table)}.blade.php`;
			},
			prepareItems: this.belongsToRelationsFromItems.bind(this),
		});

		templates[this.templateKey('form')] = new GeneratorForItem({
			template: this.templateFile('livewire/form'),
			source: this.configuration.source(),
			directory: this.directory('/app/Livewire/Generathor/Forms'),
			fileName: (item: Item) =>
				`${naming.modelClass((item as LaravelItem).definition.table)}Form.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('attach-form')] = new GeneratorForItem({
			template: this.templateFile('livewire/attach-form'),
			source: this.configuration.source(),
			directory: this.directory('/app/Livewire/Generathor/Forms'),
			fileName: (item: Item) =>
				`Attach${naming.modelClass((item as LaravelItem).definition.table)}Form.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		return templates;
	}
}
