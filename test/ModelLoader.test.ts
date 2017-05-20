import { expect } from 'chai';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import Container from '../src/DI/DIContainer';

import modelLoader from '../src/model.loader';

let mockgoose: Mockgoose = new Mockgoose(mongoose);

describe('ModelLoader:', function() {
  this.timeout(20000000);

  before(async () => {
    await mockgoose.prepareStorage();
  });

  it('should load a test model', async () => {
    const container = await modelLoader(null, path.join(__dirname, '../test/test.model.ts'));

    expect(container).instanceOf(Container);
  });

  it('should throw an error when factory does not return model', async () => {
    let error;

    try {
      await modelLoader(null, path.join(__dirname, '../test/invalid-test.model.ts'))
      console.log('he');
    } catch (e) {
      error = e;
    }

    expect(error).to.be.instanceOf(Error);
  });
});
