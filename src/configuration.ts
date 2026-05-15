export type ConfigurationAttributes = {
	laravelVersion?: 13;
	onlyEloquentModels?: boolean;
	createLaravelUserModel?: boolean;
	reference?: string;
	source?: string;
	directory?: string;
	homeRoute?: string;
	eloquent?: {
		parent?: string;
		customParents?: Record<string, string>;
	};
};

export class Configuration {
	public constructor(private readonly attributes: ConfigurationAttributes) {}

	public directory(): string {
		return this.attributes.directory || '.';
	}

	public reference(): string {
		return this.attributes.reference || 'laravel';
	}

	public laravelVersion(): number {
		return this.attributes.laravelVersion || 13;
	}

	public createLaravelUserModel(): boolean {
		return this.attributes.createLaravelUserModel ?? false;
	}

	public createOnlyEloquentModels(): boolean {
		return this.attributes.onlyEloquentModels ?? true;
	}

	public source(): string {
		return this.attributes.source || 'db';
	}

	public homeRoute(): string {
		return this.attributes.homeRoute || 'home';
	}

	public eloquentParent(table: string): string {
		const map = this.attributes.eloquent?.customParents || {};

		if (map[table]) {
			return map[table];
		}

		return this.attributes.eloquent?.parent || 'Illuminate\\Database\\Eloquent\\Model';
	}
}
