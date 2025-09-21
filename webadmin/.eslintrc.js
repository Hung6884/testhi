module.exports = {
  extends: [
    require.resolve('@umijs/lint/dist/config/eslint'),
    require.resolve('@dat/eslint-config'),
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'no-dupe-class-members': 1,
    'no-dupe-keys': 1,
    'no-dupe-args': 1,
    'no-unused-vars': 1,
    'no-duplicate-imports': 1,
    'no-redeclare': 2,
    'no-undef': 2,
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
        allowNamedExports: false,
      },
    ],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/jsx-no-undef': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'no-else-return': 2,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './jsconfig.json',
    createDefaultProgram: true,
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    es2020: true,
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
