const { readdirSync, readFileSync, writeFileSync } = require('fs');
const micromatch = require('micromatch');
const path = require('path');

const split = require('lodash/split');
const get = require('lodash/get');

function collectComponentRenderer() {
  try {
    const result = {};
    const renderersPath = path.resolve(__dirname, '../src', 'renderers');

    const permissionPaths = micromatch(
      readdirSync(renderersPath, { recursive: true }),
      ['**/permissions.json', '!permissions.json'],
    );

    for (const permissionPath of permissionPaths) {
      try {
        const permissions = JSON.parse(
          readFileSync(path.resolve(renderersPath, permissionPath)).toString(),
        );

        if (permissions) {
          const projectName = get(
            permissions,
            '__name',
            split(permissionPath, /[/\/]/g).shift(),
          );
          delete permissions.__name;
          result[projectName] = {
            ...get(result, projectName, {}),
            ...permissions,
          };
        }
      } catch (_error) {}
    }

    writeFileSync(
      path.resolve(renderersPath, 'permissions.json'),
      JSON.stringify(result),
      { flag: 'w' },
    );
  } catch (_error) {
    console.error('AN_ERROR_OCCURRED_WHILE_COLLLECT_PERMISSION', _error);
    return null;
  }
}

module.exports = collectComponentRenderer;
