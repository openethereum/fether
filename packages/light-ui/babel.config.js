module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    ['emotion', { sourceMap: true, autoLabel: true }]
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
