import type { Column, Relation } from 'generathor-db';
import naming from './naming.js';
import * as typeHelper from './type.js';

const ignoreInputsFor: Record<string, boolean> = {
	created_at: true,
	updated_at: true,
};

export function inputsByColumn(column: Column, fks: Record<string, Relation>, filter = false) {
	if (column.autoincrement) {
		return [];
	}
	if (ignoreInputsFor[column.name] && !filter) {
		return [];
	}
	if (fks[column.name]) {
		return [
			{
				type: 'record',
				name: column.name,
				label: naming.columnLabel(column),
				data: {
					context: naming.searchContext((fks[column.name] as Relation).on.table),
				},
			},
		];
	}
	if (
		column.type === 'string' &&
		column.enum &&
		Array.isArray(column.enum) &&
		column.enum.length > 0
	) {
		return [
			{
				type: 'select',
				name: column.name,
				label: naming.columnLabel(column),
				data: {
					options: [
						{
							value: '',
							label: 'Select',
						},
					].concat(
						column.enum.map((value) => ({
							value: value,
							label: naming.label(value),
						})),
					),
				},
			},
		];
	}
	if (column.type === 'boolean') {
		return [
			filter
				? {
						type: 'select',
						name: column.name,
						label: naming.columnLabel(column),
						data: {
							options: [
								{
									value: '',
									label: 'Select',
								},
								{
									value: '0',
									label: 'No',
								},
								{
									value: '1',
									label: 'Yes',
								},
							],
						},
					}
				: {
						type: 'checkbox',
						name: column.name,
						label: naming.columnLabel(column),
					},
		];
	}
	if (column.type === 'int' || column.type === 'float') {
		const decimals = column.type === 'int' ? 0 : column.scale;
		return filter
			? [
					{
						type: 'number',
						name: `${column.name}_from`,
						label: naming.label(`${column.name}_from`),
						data: {
							decimals,
						},
					},
					{
						type: 'number',
						name: `${column.name}_to`,
						label: naming.label(`${column.name}_to`),
						data: {
							decimals,
						},
					},
				]
			: [
					{
						type: 'number',
						name: column.name,
						label: naming.label(column.name),
						data: {
							decimals,
						},
					},
				];
	}
	const dates: Record<string, boolean> = {
		datetime: true,
		time: true,
		date: true,
	};
	if (dates[column.subType as string]) {
		return filter
			? [
					{
						type: column.subType,
						name: `${column.name}_from`,
						label: naming.label(`${column.name}_from`),
					},
					{
						type: column.subType,
						name: `${column.name}_to`,
						label: naming.label(`${column.name}_to`),
					},
				]
			: [
					{
						type: column.subType,
						name: column.name,
						label: naming.label(column.name),
					},
				];
	}

	return [
		{
			type: 'text',
			name: column.name,
			label: naming.columnLabel(column),
		},
	];
}

export function defaultInputValues(columns: Array<Column>, fks: Record<string, Relation>) {
	const result: Record<string, unknown> = {};
	columns.forEach((column) => {
		if (column.autoincrement) {
			return;
		}
		if (ignoreInputsFor[column.name]) {
			return;
		}
		if (fks[column.name]) {
			return;
		}
		if (column.type !== 'date' && column.default !== null) {
			result[column.name] = column.default;
			return;
		}
		if (column.type === 'boolean' && !column.nullable) {
			result[column.name] = false;
		}
	});

	return result;
}

export function rules(column: Column) {
	if (column.autoincrement || ignoreInputsFor[column.name]) {
		return [];
	}
	const rules = [column.nullable ? 'nullable' : 'required'];

	if (column.type === 'string' && column.enum && Array.isArray(column.enum)) {
		const rule = `in:${column.enum.join(',')}`;
		rules.push(rule);
	}

	const ruleType = typeHelper.ruleType(column);
	if (column.type !== 'date') {
		rules.push(ruleType);
	}

	const dateRuleType = typeHelper.dateRuleType(column);
	if (column.type === 'date' && dateRuleType) {
		rules.push(dateRuleType);
	}

	return rules;
}
