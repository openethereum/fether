module.exports = {
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  // craco isn't compatible with monorepos by default
  reactScriptsPath: '../../node_modules/react-scripts'
};
