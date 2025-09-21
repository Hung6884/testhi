const path = require('path');
const packageJSON = require('../package.json');

const alias = packageJSON['node-module-alias'];

function resolveEslintAlias() {
  return Object.entries(alias).map(([key, value]) => [
    key,
    path.resolve(value),
  ]);
}

function resolveJSConfigAlias() {
  return Object.entries(alias).reduce((res, [key, value]) => {
    res[`${key}/*`] = [`${value}/*`];

    return res;
  }, {});
}

function resolveModuleAlias(dirname) {
  return Object.entries(alias).reduce((res, [key, value]) => {
    res[`${key}`] = [`${path.join(dirname, value)}`];
    return res;
  }, {});
}

module.exports = {
  resolveEslintAlias,
  resolveJSConfigAlias,
  resolveModuleAlias,
};
