const path = require('path');
const menubar = require('menubar');

const packagesDir = __dirname.substring(0, __dirname.lastIndexOf('/'));
const indexHtmlFile =
  'file://' + path.join(__dirname, '/static/build/index.html');
const iconFile = path.join(
  packagesDir,
  '/fether-react/src/assets/img/logos/parity-icon.png'
);

const mb = menubar({
  dir: __dirname,
  index: indexHtmlFile,
  showDockIcon: true,
  icon: iconFile,
  tooltip: 'Fether',
  width: 352,
  height: 464
});

mb.on('ready', () => {
  console.log('Fether is ready');

  mb.showWindow();
});
