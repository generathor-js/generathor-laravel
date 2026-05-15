import type { GeneratorForCollection, GeneratorForItem } from 'generathor';

export type GeneratorType = GeneratorForItem | GeneratorForCollection;

export interface GeneratorProvider {
	getGenerators(): Record<string, GeneratorType>;
}
