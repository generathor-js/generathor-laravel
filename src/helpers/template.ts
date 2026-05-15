import { resolve } from 'node:path';

export function file(fileName: string) {
	return resolve(__dirname, `../../templates/${fileName}.ejs`);
}
