import { expect } from 'chai';
import Route from './Route';

describe.only('Route', () => {
    it('Test `path` decorator', () => {
        class SimpleRoute extends Route {
            @Route.path('/test')
            someDest() {}
        }
       expect(SimpleRoute).to.have.deep.property('_methods.SimpleRoute\\.someDest.path', '/test');
    });

    it('Test `middleware` decorator', () => {
        const f = () => 0;
        class SimpleRoute extends Route {
            @Route.middleware(f)
            someDest() {}
        }
       expect(SimpleRoute).to.be.deep.property('_methods.SimpleRoute\\.someDest.middleware.0', f);
    });
});