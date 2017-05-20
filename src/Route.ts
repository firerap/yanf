import { Router } from 'express';
import * as _ from 'lodash';

const ALLOWED_HTTP_METHODS = ['get', 'post', 'delete', 'patch'];

export default class Route {
  private static _methods = new Object();
  private _router: Router;

  constructor() {
    this._router = Router();
  }

  static createRouteDescriptor(target, key) {
    var name = `${target.constructor.name}.${key}`;

    if (!this._methods[name]) this._methods[name] = {
      middleware: [],
      method: 'get',
      handler: target[key],
      name: name,
      access: 'public',
    };

    return this._methods[name];
  }

  static method(_method) {
    if (!ALLOWED_HTTP_METHODS.includes(_method)) {
      throw new Error('Unknown method ' + _method)
    }

    return (target, key, descriptor) => {
      const routeDescriptor = this.createRouteDescriptor(target, key);
      routeDescriptor.method = _method;
      return descriptor;
    };
  }

  static middleware(_middleware) {
    if (!Array.isArray(_middleware)) {
      _middleware = [_middleware];
    }
    if (!_middleware.every(_.isFunction)) {
      throw new Error('Some middleware is not a function');
    }

    return (target, key, descriptor) => {
      const routeDescriptor = this.createRouteDescriptor(target, key);
      routeDescriptor.middleware.push(..._middleware);
      return descriptor;
    };
  }

  static path(_path) {
    if (!_.isString(_path)) {
      throw new Error('Incorrect path format.');
    }

    return (target, key, descriptor) => {
      const routeDescriptor = this.createRouteDescriptor(target, key);
      routeDescriptor.path = _path;
      return descriptor;
    };
  }
}
