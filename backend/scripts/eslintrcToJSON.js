const { writeFileSync } = require('fs-extra');
const path = require('path');
const { resolveEslintAlias } = require('./resolveAlias');

const eslintConfigs = {
  env: {
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.jsx'],
        map: resolveEslintAlias(),
      },
    },
  },
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    camelcase: 0,
    'global-require': 0,
    'no-dupe-class-members': 1,
    'no-dupe-keys': 1,
    'no-dupe-args': 1,
    'no-unused-vars': 1,
    'no-duplicate-imports': 1,
    'no-redeclare': 2,
    'no-undef': 'error',
    'no-return-await': 0,
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-empty': 0,
    'no-unused-expressions': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'no-prototype-builtins': 0,
    'no-nested-ternary': 0,
    'no-continue': 0,
    'no-bitwise': 0,
    'prefer-const': 1,
    eqeqeq: 0,
    radix: 0,
    'guard-for-in': 0,
    'array-callback-return': 0,
    'no-shadow': 0,
    'func-names': 'off',
    'consistent-return': 'off',
    'jest/expect-expect': 'off',
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-fs-filename': 0,
    'security/detect-non-literal-require': 0,
    'import/extensions': 0,
    'import/order': 1,
    'import/no-dynamic-require': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
      },
    ],
  },
};

function eslintToJSON() {
  writeFileSync(
    path.resolve(__dirname, '../.eslintrc.json'),
    JSON.stringify(eslintConfigs, null, 2),
    { flag: 'w' },
  );
}

module.exports = eslintToJSON;
