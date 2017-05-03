import { expect } from 'chai';
import * as DI from './';
import Inject from './Inject';
import DIContainer from './DIContainer';

describe('@Inject', () => {
    it('Simple test', () => {
        @Inject(['test', 'test2'])
        class Dumb {}
        
        expect(Dumb['__inject']).to.be.a('array');
    });
})

describe('DI.apply', () => {
    it('Should inject correctly from multiple containers', () => {
        @Inject(['test', 'test2'])
        class Dumb {}
        const dumb = new Dumb();

        const container1 = new DIContainer();
        const container2 = new DIContainer();
        container1.set('test', { info: 'test dependency' });
        container2.set('test2', { info: 'test2 dependency' });
        const containers = [container1, container2];

        DI.apply(containers, dumb);

        expect(dumb).to.has.deep.property('test.info');
        expect(dumb).to.has.deep.property('test2.info');
        expect(dumb).to.has.not.deep.property('test3.info');
    });

    it('Should throw error if one of dependencies not found', () => {
        @Inject(['test', 'test2'])
        class Dumb {}
        const dumb = new Dumb();
        
        const container1 = new DIContainer();
        const container2 = new DIContainer();
        container2.set('test', {});
        container2.set('test3', {});

        const containers = [container1, container2];
        
        const f = () => DI.apply(containers, dumb);
        expect(f).to.throw(Error);
    });

    it('Should throw error if one of properties', () => {
        @Inject(['test', 'test2'])
        class Dumb {}
        const dumb = new Dumb();
        dumb['test2'] = 'SOME_VALUE';
        
        const container1 = new DIContainer();
        const container2 = new DIContainer();
        container2.set('test', {});
        container2.set('test2', {});

        const containers = [container1, container2];
        
        const f = () => DI.apply(containers, dumb);
        expect(f).to.throw(Error);
    });
});