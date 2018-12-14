const { injectBabelPlugin } = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override (config) {
  // use the MobX rewire to use @decorators
  config = injectBabelPlugin(
    ['@babel/proposal-decorators', { legacy: true }],
    config
  );
  return config;
};
