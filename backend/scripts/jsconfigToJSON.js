const { writeFileSync } = require('fs-extra');
const path = require('path');
const { resolveJSConfigAlias } = require('./resolveAlias');

const jsconfigs = {
  compilerOptions: {
    baseUrl: '.',
    paths: resolveJSConfigAlias(),
  },
  include: ['src/*'],
};

function jsconfigToJSON() {
  writeFileSync(
    path.resolve(__dirname, '../jsconfig.json'),
    JSON.stringify(jsconfigs, null, 2),
    { flag: 'w' },
  );
}

module.exports = jsconfigToJSON;
