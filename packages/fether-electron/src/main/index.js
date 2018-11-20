// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import parityElectron, {
  getParityPath,
  fetchParity,
  isParityRunning,
  runParity,
  killParity
} from '@parity/electron';
import electron from 'electron';
import getRemainingArgs from 'commander-remaining-args';
import path from 'path';
import url from 'url';

import addMenu from './menu';
import cli from './cli';
import handleError from './utils/handleError';
import messages from './messages';
import { parity } from '../../package.json';
import Pino from './utils/pino';
import { productName } from '../../electron-builder.json';
import staticPath from './utils/staticPath';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';

const { app, BrowserWindow, ipcMain, session } = electron;
let mainWindow;
const pino = Pino();

// Disable gpu acceleration on linux
// https://github.com/parity-js/fether/issues/85
if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration();
}

function createWindow () {
  pino.info(`Starting ${productName}...`);
  mainWindow = new BrowserWindow({
    height: 640,
    resizable: false,
    width: 360
  });

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  // Set options for @parity/electron
  parityElectron({
    logger: namespace => log => Pino({ name: namespace }).info(log)
  });

  // Look if Parity is installed
  getParityPath()
    .catch(() =>
      // Install parity if not present
      fetchParity(mainWindow, {
        onProgress: progress =>
          // Notify the renderers on download progress
          mainWindow.webContents.send('parity-download-progress', progress),
        parityChannel: parity.channel
      })
    )
    .then(async () => {
      // Run parity when installed

      // Don't run parity if the user ran fether with --no-run-parity
      if (!cli.runParity) {
        return;
      }

      if (
        await isParityRunning({
          wsInterface: cli.wsInterface,
          wsPort: cli.wsPort
        })
      ) {
        return;
      }

      return runParity({
        flags: [
          ...getRemainingArgs(cli),
          '--light',
          '--chain',
          cli.chain,
          '--ws-interface',
          cli.wsInterface,
          '--ws-port',
          cli.wsPort
        ],
        onParityError: err => handleError(err, 'An error occured with Parity.')
      });
    })
    .then(() => {
      // Notify the renderers
      mainWindow.webContents.send('parity-running', true);
      global.isParityRunning = true; // Send this variable to renderes via IPC
    })
    .catch(handleError);

  // Globals for fether-react parityStore
  global.wsInterface = cli.wsInterface;
  global.wsPort = cli.wsPort;

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(staticPath, 'build', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
  );

  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', (...args) =>
    messages(mainWindow, ...args)
  );

  // Add application menu
  addMenu(mainWindow);

  // WS calls have Origin `file://` by default, which is not trusted.
  // We override Origin header on all WS connections with an authorized one.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['ws://*/*', 'wss://*/*']
    },
    (details, callback) => {
      if (!mainWindow) {
        // There might be a split second where the user closes the app, so
        // mainWindow is null, but there is still a network request done.
        return;
      }
      details.requestHeaders.Origin = `parity://${mainWindow.id}.ui.parity`;
      callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
    }
  );

  // Open external links in browser
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    killParity();
    app.quit();
  }
});

// Make sure parity stops when UI stops
app.on('before-quit', killParity);
app.on('will-quit', killParity);
app.on('quit', killParity);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
