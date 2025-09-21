const join = require('lodash/join');
const entries = require('lodash/entries');

export function convertTableSortsToQuery(sorts) {
  return join(
    entries(sorts).map(
      ([key, value]) => `${value === 'descend' ? '-' : ''}${key}`,
    ),
    ',',
  );
}
