import * as path from 'path';
import { Schema, Model } from 'mongoose';
import * as glob from 'glob';
import * as _ from 'lodash';
// import Route from './Route';
import * as DI from './DI';
import * as mongoose from 'mongoose';

export default async function ModelLoader(__, pattern: string): Promise<DI.Container> {
  await mongoose.connect('mongodb://foobar/baz');

  const modelContainer: DI.Container = new DI.Container();

  const loaded = glob
    .sync(pattern)
    .forEach(path_ => {
      const modelFactory = require(path_).default;

      if (!_.isFunction(modelFactory)) {
        throw new Error('Each model should be a function');
      }

      const model: Model<any> = modelFactory(mongoose.connection);
      const modelType = _.get(model, 'prototype.constructor.name');

      if (modelType !== 'model') {
        throw new Error('All models should be of mongoose Model');
      }

      modelContainer.set(model.modelName, model);
    });

  return modelContainer;
}
