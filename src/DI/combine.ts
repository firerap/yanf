import _ from 'lodash';
import DIContainer from './DIContainer';

export default function combine(containers: Array<DIContainer>) {
  const result = new DIContainer();
  for (const container of containers) {
    result.include(container);
  }
  return result;
}
