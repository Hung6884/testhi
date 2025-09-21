const { isString, isEmpty } = require('lodash');
const reduce = require('lodash/reduce');
function convertQuerySortToObject(querySort) {
  return reduce(
    querySort.split(','),
    (res, sort) => {
      let field = sort;
      let order = 'ASC';
      if (sort.charAt(0) === '-') {
        order = 'DESC';
        field = sort.substring(1); // everything after first char
      }

      if (isString(field) && !isEmpty(field)) {
        return [...res, [field, order]];
      }

      return res;
    },
    [],
  );
}

module.exports = { convertQuerySortToObject };
