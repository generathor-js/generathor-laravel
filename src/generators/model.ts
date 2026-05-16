import { existsSync } from 'node:fs';
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
			prepareItems: (items: Array<Item>) => {
				if (this.configuration.createLaravelUserModel()) {
					items = items.filter((item) => (item as DBItem).table !== 'users');
				}

				return this.prepareItems(items as Array<DBItem>);
			},
		});

		const laravelUserModelFile = this.directory('/app/Models/LaravelUser.php');
		if (this.configuration.createLaravelUserModel()) {
			templates[this.templateKey('child-model-user')] = new GeneratorForItem({
				template: this.templateFile('eloquent/child'),
				source: this.configuration.source(),
				directory: this.directory('/app/Models'),
				overwriteFiles: !existsSync(laravelUserModelFile),
				fileName: (item: Item) =>
					`${naming.modelClass((item as LaravelItem).definition.table)}.php`,
				prepareItems: (items: Array<Item>) =>
					this.prepareItems(
						items.filter((item: Item) => (item as DBItem).table === 'users') as Array<DBItem>,
					),
			});

			templates[this.templateKey('laravel-user-model')] = new GeneratorForCollection({
				template: this.templateFile(
					`eloquent/user-${this.configuration.laravelVersion().toString()}`,
				),
				source: this.configuration.source(),
				overwriteFiles: this.overwriteFiles(),
				prepareItems: () => [],
				file: laravelUserModelFile,
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
