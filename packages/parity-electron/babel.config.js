module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
        moduleName: '@babel/runtime'
      }
    ]
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
