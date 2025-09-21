const devEnvironments = ['development', 'test'];

module.exports = (api) => {
  const development = api.env(devEnvironments);

  return {
    presets: [['@babel/preset-env'], ['@babel/preset-react', { development }]],
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-typescript',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-logical-assignment-operators',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-do-expressions',
      [
        '@babel/plugin-transform-decorators',
        {
          legacy: true,
        },
      ],
      '@babel/plugin-transform-function-sent',
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-throw-expressions',
      '@babel/plugin-transform-private-property-in-object',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-transform-json-strings',
    ],
  };
};
