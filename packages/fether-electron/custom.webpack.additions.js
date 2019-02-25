// https://webpack.electron.build/add-ons
// https://www.npmjs.com/package/webpack-build-notifier
const path = require('path');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: 'Fether Webpack Build',
      logo: path.resolve('./build/favicon.ico'),
      suppressSuccess: false,
      compileIcon: path.resolve('./static/assets/icons/webpack/compile.png'),
      failureIcon: path.resolve('./static/assets/icons/webpack/failure.png'),
      successIcon: path.resolve('./static/assets/icons/webpack/success.png'),
      warningIcon: path.resolve('./static/assets/icons/webpack/warning.png')
    })
  ]
};
