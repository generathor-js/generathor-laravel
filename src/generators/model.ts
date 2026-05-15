import { GeneratorForCollection, GeneratorForItem, type Item } from 'generathor';
import type { Item as DBItem } from 'generathor-db';
import naming from '../helpers/naming.js';
import { BaseGeneratorProvider, type LaravelItem } from './base.js';
import type { GeneratorType } from './contracts.js';

export class ModelGeneratorProvider extends BaseGeneratorProvider {
	public getGenerators(): Record<string, GeneratorType> {
		const templates: Record<string, GeneratorType> = {};

		templates[this.templateKey('parent-model')] = new GeneratorForItem({
			template: this.templateFile('eloquent/parent'),
			source: this.configuration.source(),
			directory: this.directory('/app/Models/Generathor'),
			fileName: (item: Item) => `${naming.modelClass((item as LaravelItem).definition.table)}.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('child-model')] = new GeneratorForItem({
			template: this.templateFile('eloquent/child'),
			source: this.configuration.source(),
			directory: this.directory('/app/Models'),
			overwriteFiles: this.overwriteFiles(),
			fileName: (item: Item) => `${naming.modelClass((item as LaravelItem).definition.table)}.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		if (this.configuration.createLaravelUserModel()) {
			templates[this.templateKey('user-model')] = new GeneratorForCollection({
				template: this.templateFile(
					`eloquent/user-${this.configuration.laravelVersion().toString()}`,
				),
				source: this.configuration.source(),
				overwriteFiles: this.overwriteFiles(),
				prepareItems: () => [],
				file: this.directory('/app/Models/LaravelUser.php'),
			});
		}

		templates[this.templateKey('filter-model')] = new GeneratorForItem({
			template: this.templateFile('eloquent/filter'),
			source: this.configuration.source(),
			directory: this.directory('/app/ModelFilters'),
			fileName: (item: Item) =>
				`${naming.modelClass((item as LaravelItem).definition.table)}Filter.php`,
			prepareItems: (items: Array<Item>) => this.prepareItems(items as Array<DBItem>),
		});

		templates[this.templateKey('model-pk-trait')] = new GeneratorForCollection({
			template: this.templateFile('eloquent/pk-trait'),
			source: this.configuration.source(),
			overwriteFiles: this.overwriteFiles(),
			prepareItems: () => [],
			file: this.directory('/app/Models/Generathor/GenerathorKey.php'),
		});

		return templates;
	}
}
