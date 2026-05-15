import type { Column } from 'generathor-db';

const typeMapper: Record<string, string> = {
	string: 'string',
	date: 'string|Carbon',
	int: 'int',
	float: 'float',
	boolean: 'bool',
};
const ruleTypeMapper: Record<string, string> = {
	string: 'string',
	date: 'date',
	int: 'int',
	float: 'decimal',
	boolean: 'boolean',
};
const dateSubTypeRuleMapper: Record<string, string> = {
	datetime: 'date_format:Y-m-d H:i:s',
	time: 'date_format:H:i:s',
	date: 'date',
};

export function phpType(type: string) {
	return typeMapper[type];
}

export function ruleType(column: Column) {
	let rule = ruleTypeMapper[column.type] as string;

	if (rule === 'decimal') {
		rule = `${rule}:0,${String(column.scale)}`;
	}

	if (column.unsigned) {
		rule = `${rule}|min:0`;
	}

	return rule;
}

export function dateRuleType(column: Column) {
	return dateSubTypeRuleMapper[column.subType || 'date'];
}
