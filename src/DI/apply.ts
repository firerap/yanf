import * as _ from 'lodash';
import DIContainer from './DIContainer';

export default function apply(containers: Array<DIContainer>, obj: Object) {
  const dependencies = _.get(obj, 'constructor.__inject');
  const className = _.get(obj, 'name') || _.get(obj, 'constructor.name') || '';

  if (!Array.isArray(dependencies)) {
    throw new Error(`Nothing to inject in class '${className}'. Need to apply @Inject.`);
  }

  out: for (const dependency of dependencies) {
    const E_IMPOSSIBLE = `Impossible to inject dependency '${dependency}' to class '${className}'.`;
    for (const container of containers) {
      if (container.has(dependency)) {
        // applying exact dependency to exact class here.
        if (!_.isUndefined(obj[dependency])) {
          throw new Error(`${E_IMPOSSIBLE} Such property already exists.`);
        }
        obj[dependency] = container.get(dependency);
        continue out;
      }
    }
    throw new Error(`${E_IMPOSSIBLE} Not found such dependency.`);
  }
}
