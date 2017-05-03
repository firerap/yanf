import { readFileSync } from 'fs';
import * as path from 'path';
import * as nconf from 'nconf';

import { IConfig } from './IConfig';

const DEFAULT_ENV = 'local';

export default class Config implements IConfig {

	get(): any {}
	set(): void {}

    private loadFile(path_) {
        try {
			const data = JSON.parse(readFileSync(path_).toString());
			return data;
		} catch (err) {
			return {};
		}
    }

	constructor(options: { env?: string, dir?: string }) {
        if (!options.env) options.env = DEFAULT_ENV;
        if (!options.dir) throw new Error('Property `dir` is required.');
        const defaultConfig = this.loadFile(path.join(options.dir, 'config.json'));

		const env = options.env.toLowerCase();

		nconf
			.argv()
			.env({
				separator: '_',
				lowerCase: true,
			})
			.file({
				file: path.join(options.dir, 'env', `${env}.json`),
			})
			.defaults(defaultConfig);

		this.get = nconf.get.bind(nconf);
		this.set = nconf.set.bind(nconf);
	}
}
