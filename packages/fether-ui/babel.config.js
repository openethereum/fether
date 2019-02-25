module.exports = {
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    'inline-import-data-uri'
  ],
  presets: ['@babel/preset-env', '@babel/preset-react']
};
