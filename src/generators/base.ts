import type { Item } from 'generathor';
import type { Item as DBItem, Relation } from 'generathor-db';
import type { Configuration } from '../configuration.js';
import * as columnHelper from '../helpers/column.js';
import * as itemHelper from '../helpers/item.js';
import naming from '../helpers/naming.js';
import * as template from '../helpers/template.js';
import * as typeHelper from '../helpers/type.js';
import type { GeneratorProvider, GeneratorType } from './contracts.js';

export type LaravelItem = {
	configuration: Configuration;
	helpers: ReturnType<BaseGeneratorProvider['helpers']>;
	definition: DBItem;
	relation?: Relation;
	relatedItem?: DBItem;
};
export abstract class BaseGeneratorProvider implements GeneratorProvider {
	constructor(protected readonly configuration: Configuration) {}

	public abstract getGenerators(): Record<string, GeneratorType>;

	protected templateKey(key: string): string {
		return `${this.configuration.reference()}-${key}`;
	}

	protected templateFile(file: string): string {
		return template.file(file);
	}

	protected overwriteFiles() {
		return false;
	}

	protected directory(path: string): string {
		return this.configuration.directory() + path;
	}

	protected prepareItems(items: Array<DBItem>): Array<Item> {
		return items.map((item: Item) => {
			return {
				definition: item,
				configuration: this.configuration,
				helpers: this.helpers(),
			};
		});
	}

	protected hasManyRelationsFromItems(items: Array<Item>) {
		return this.relationsFromItems(items, 'has-many');
	}

	protected belongsToRelationsFromItems(items: Array<Item>) {
		return this.relationsFromItems(items, 'belongs-to');
	}

	protected relationsFromItems(items: Array<Item>, relationType: string): Array<Item> {
		const itemMap = items.reduce((acc: Record<string, Item>, item: Item) => {
			acc[item.table as string] = item;

			return acc;
		}, {});

		const result: Array<Item> = [];
		for (const item of items) {
			for (const relation of (item as DBItem).relations) {
				if (relation.type !== relationType) {
					continue;
				}

				result.push({
					definition: item,
					relation: relation,
					relatedItem: itemMap[relation.on.table],
					configuration: this.configuration,
					helpers: this.helpers(),
				});
			}
		}

		return result;
	}

	protected helpers() {
		return {
			naming: naming,
			type: typeHelper,
			item: itemHelper,
			column: columnHelper,
			template: template,
		};
	}
}
