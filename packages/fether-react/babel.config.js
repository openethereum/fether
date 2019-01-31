module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-modules-commonjs'
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
