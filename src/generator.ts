import { Configuration, type ConfigurationAttributes } from './configuration.js';
import type { GeneratorType } from './generators/contracts.js';
import { LivewireGeneratorProvider } from './generators/livewire.js';
import { ModelGeneratorProvider } from './generators/model.js';
export class LaravelGenerator {
	private readonly configuration: Configuration;

	public constructor(configuration?: ConfigurationAttributes) {
		this.configuration = new Configuration(configuration || {});
	}

	public generators(): Record<string, GeneratorType> {
		const providers = this.providers();

		let allGenerators: Record<string, GeneratorType> = {};

		for (const provider of providers) {
			allGenerators = {
				...allGenerators,
				...provider.getGenerators(),
			};
		}

		return allGenerators;
	}

	private providers() {
		if (this.configuration.createOnlyEloquentModels()) {
			return [new ModelGeneratorProvider(this.configuration)];
		}

		return [
			new ModelGeneratorProvider(this.configuration),
			new LivewireGeneratorProvider(this.configuration),
		];
	}
}
