const { injectBabelPlugin } = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override (config) {
  // use the MobX rewire to use @decorators
  config = injectBabelPlugin('transform-decorators-legacy', config);

  return config;
};
