import * as path from 'path';
import * as _ from 'lodash';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import Logger from './Logger';
import Config from './Config';
import * as DI from './DI';

import { ILogger } from './ILogger';
import { IConfig } from './IConfig';

import RouteLoader from './routes.loader';

export interface IServerOptions {
  env?: string,
  dir?: string,
  autoload?: boolean,
};

export type ILoadHandler = (f: Function, s: string) => DI.Container | void;

export interface ILoadOptions {
  name: string,
  pattern?: string,
  handler?: ILoadHandler | string,
  inject?: Array<string | DI.Container>,
}

const DEFAULT_PORT = 3000;

export default class Server {
  private _logger: ILogger;
  private _config: IConfig;
  private _app: express.Application;
  private _containers: Map<string, DI.Container> = new Map();
  private dir: string;
  private isListening: boolean = false;
  private prefix = '/api';

  setLogger(logger: ILogger) { this._logger = logger; }
  addContainer(name: string, container: DI.Container) { this._containers.set(name, container); }

  constructor(options: IServerOptions) {
    this.dir = options.dir || process.cwd();
    this.setLogger(new Logger());

    const configDir = path.join(this.dir, 'config');
    this._config = new Config({
      dir: configDir,
    });

    const mainContainer = new DI.Container();

    mainContainer.set('config', this._config);
    mainContainer.set('logger', this._logger);
    this.addContainer('main', mainContainer);

    if (options.autoload) {
      this.autoload();
    }
  }

  private _getLoadHandlerByName(name: string): ILoadHandler {
    switch(name) {
      case 'routes': return RouteLoader;
    }
    throw new Error(`Default load handler with name ${name} not found.`);
  }

  load(options: ILoadOptions) {
    if (!_.isString(options.name)) {
      throw new Error('`name` is required parameter for `load` method.');
    }

    let handler: ILoadHandler = null;

    switch (typeof options.handler) {
      case 'function': {
        handler = <ILoadHandler>options.handler;
        break;
      }
      case 'string': {
        handler = this._getLoadHandlerByName(<string>options.handler);
        break;
      }
      default: {
        handler = this._getLoadHandlerByName(name);
      }
    }

    const dependencies = options.inject.map(container => {
      if (container instanceof DI.Container) {
        return container;
      }
      if (!this._containers.has(container)) {
        throw new Error(`DI.Container with name ${container} does not exist.`);
      }

      return this._containers.get(container);
    });

    const applyDependencies = (obj) => DI.apply(dependencies, obj);
    const container = handler(applyDependencies, options.pattern);

    if (container instanceof DI.Container) {
      this.addContainer(options.name, container);
    } else {
      throw new Error('Load handler should export DI.Container');
    }
  }

  autoload() {
    // TODO: Implement automatic default strategy for loading components.
    // this.load({
    //     name: 'dao',
    // });
    const pathPattern = path.join(this.dir, './**/*.route.{js,ts}');

    console.log(pathPattern);

    this.load({
      name: 'routes',
      pattern: pathPattern,
      inject: ['main'],
      // inject: ['dao'],
    });
    this.initServer();
  }

  initServer() {
    this._app = express();
    this._app.disable('x-powered-by');
    // this.app.use(this.fsendRegisterMiddleware());

    this._app.use(cookieParser());
    this._app.use(bodyParser.json(this._config.get('server:bodyParser:json')));
    this._app.use(bodyParser.urlencoded(this._config.get('server:bodyParser:urlencoded')));

    const allDependencies = DI.combine([...this._containers.values()]);

    if (allDependencies.has('Router')) {
      const router = allDependencies.get('Router');

      this._app.use(this.prefix, router);
    }
    // this.app.use(requestId());
    // this.app.use(sessions(this.config.get('server:session')));
  }

  listen() {
    if (!this._app) {
      throw new Error('Server should be initialized firstly');
    }

    this.isListening = true;
    const port: number = this._config.get('port') || DEFAULT_PORT;

    return new Promise((resolve, reject) => {
      this._app.listen(port, err => {
        if (err) return reject(err);
        resolve();
      });
    })
  }
}
