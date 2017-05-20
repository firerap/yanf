import * as path from 'path';
import { Router } from 'express';
import * as glob from 'glob';
import * as _ from 'lodash';
import Route from './Route';
import * as DI from './DI';

// import AccessError from '../errors/access.error';

// function accessFactory(access) {
//   return function(req, res, next) {
//     if (access === 'public') return next();
//     if (access === 'user' && req.user) return next();
//     next(new AccessError());
//     //...
//   }
// }

// TODO: Add flexible system for adding new factories as global middlewares, such as `access`, etc.
export default function ResourceLoader(applyDependencies: (route: Route) => void, pattern: string): DI.Container {
  const router = Router();
  const resources = glob
    .sync(pattern)
    .map(path_ => {
      const resourceClass = require(path_).default;
      const resource = new resourceClass();

      if (!(resource instanceof Route)) {
        throw new Error('Each resource should be instance of `Route`');
      }
      applyDependencies(resource);

      return resource;
    });

  for (const entry of _.entries(Route['_methods'])) {
    const [name, descriptor] = entry;
    const resourceName = name.replace(/\..+/, '');
    const resource = resources.find(resource => resource.constructor.name === resourceName);

    if (!resource) {
      throw new Error(`Resource with name ${resourceName} doesn't found`);
    }
    if (!descriptor.path) {
      throw new Error('Each route should have path.');
    }
    // const middleware = [accessFactory(descriptor.access), ...descriptor.middleware];
    const middleware = [...descriptor.middleware];

    router[descriptor.method](descriptor.path, ...middleware, async (req, res, next) => {
      try {
        const result = await descriptor.handler.call(resource, req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }
  const container = new DI.Container();

  container.set('Router', router);

  return container;
}
