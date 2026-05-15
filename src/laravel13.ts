import type { ConfigurationAttributes } from './configuration.ts';
import { LaravelGenerator } from './generator.ts';
import type { GeneratorType } from './generators/contracts.ts';

type Generators = Record<string, GeneratorType>;

function generators(configuration: ConfigurationAttributes): Generators {
	return new LaravelGenerator(configuration).generators();
}

export function eloquent(configuration?: ConfigurationAttributes): Generators {
	configuration = configuration || {};
	configuration.onlyEloquentModels = true;
	configuration.createLaravelUserModel = true;
	configuration.laravelVersion = 13;
	configuration.eloquent = configuration.eloquent || {};

	return generators(configuration);
}

export function livewire(configuration?: ConfigurationAttributes): Generators {
	configuration = configuration || {};
	configuration.onlyEloquentModels = false;
	configuration.createLaravelUserModel = true;
	configuration.laravelVersion = 13;
	configuration.eloquent = configuration.eloquent || {};

	return generators(configuration);
}
