const path = require('path');
const menubar = require('menubar');

const indexDir = 'file://' + path.join(__dirname, '/static/build/index.html');
// const indexDir = 'file://' + path.join(__dirname, '/mb.html'); // testing only
console.log(indexDir);

const mb = menubar({
  dir: __dirname,
  index: indexDir,
  showDockIcon: true,
  tooltip: 'Fether'
});

mb.on('ready', () => {
  console.log('Fether is ready');
  // your app code here

  mb.showWindow();
});

// mb.on('after-create-window', () => {
//   mb.window.openDevTools();
// });
