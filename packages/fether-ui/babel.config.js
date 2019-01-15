module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'inline-import-data-uri'
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
