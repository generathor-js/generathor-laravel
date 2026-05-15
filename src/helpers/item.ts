import type { Item, Relation } from 'generathor-db';

export function primaryKeyMap(item: Item) {
	const map: Record<string, boolean> = {};
	const columns = item.primaryKey.columns;
	for (const column of columns) {
		map[column] = true;
	}

	return map;
}

export function foreignKeysMap(item: Item): Record<string, Relation> {
	const fks: Record<string, Relation> = {};
	item.relations.forEach((relation: Relation) => {
		if (relation.type !== 'belongs-to') {
			return;
		}
		if (Object.keys(relation.columns).length === 1) {
			fks[relation.columns[0] as string] = relation;
		}
	});

	return fks;
}
