import { ILogger } from './ILogger';
// import debugHttp from 'debug-http';
import * as winston from 'winston';
// import { MongoDB as WinstonMongoDB } from 'winston-mongodb';

export default class Logger implements ILogger {
  info() {}
  verbose() {}
  debug() {}
  warn() {}
  error() {}

	constructor(options: { level?: string, console?: boolean } = {}) {
    const winstonLogger = new winston.Logger({
			level: options.level || 'verbose',
		});

		if (options.console) {
			winstonLogger.add(winston.transports.Console, {
				colorize: true,
				prettyPrint: true,
			});
		}

		// if (options.mongodb) {
		// 	winsonLogger.add(winston.transports.MongoDB, options.mongodb);
		// }

		['verbose', 'debug', 'info', 'warn', 'error'].forEach(item => {
			this[item] = winstonLogger[item].bind(winstonLogger);
		});

		// if (options.http) {
		// 	debugHttp();
		// }
	}
}
