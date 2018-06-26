// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import path from 'path';
import url from 'url';

import { doesParityExist } from './operations/doesParityExist';
import fetchParity from './operations/fetchParity';
import handleError from './operations/handleError';
import Mb from 'menubar';
import messages from './messages';
import { productName } from '../../electron-builder.json';
import Pino from './utils/pino';
import { runParity, killParity } from './operations/runParity';
import staticPath from './utils/staticPath';

const { ipcMain, Menu, session } = electron;
const pino = Pino();

const menubar = Mb({
  height: 640,
  index:
    // Opens file:///path/to/build/index.html in prod mode, or whatever is
    // passed to ELECTRON_START_URL
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(staticPath, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    }),
  preloadWindow: true,
  resizable: false,
  transparent: true,
  webPreferences: {
    nodeIntegration: true
  },
  width: 360
});

function createWindow () {
  pino.info(`Starting ${productName}...`);

  // Show window on start
  menubar.showWindow();

  doesParityExist()
    .catch(() => fetchParity(menubar.window)) // Install parity if not present
    .then(() => runParity(menubar.window))
    .catch(handleError); // Errors should be handled before, this is really just in case

  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', messages);

  // WS calls have Origin `file://` by default, which is not trusted.
  // We override Origin header on all WS connections with an authorized one.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['ws://*/*', 'wss://*/*']
    },
    (details, callback) => {
      if (!menubar.window) {
        // There might be a split second where the user closes the app, so
        // menubar.window is null, but there is still a network request done.
        return;
      }
      details.requestHeaders.Origin = `parity://${menubar.window.id}.ui.parity`;
      callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
    }
  );

  // Open external links in browser
  menubar.window.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    electron.shell.openExternal(url);
  });
}

// Right click menu for Tray
menubar.on('after-create-window', function () {
  // Add right-click menu
  const contextMenu = Menu.buildFromTemplate([
    { role: 'about' },
    { type: 'separator' },
    {
      label: 'Restart',
      click: () => {
        menubar.app.relaunch();
        menubar.app.exit();
      }
    },
    {
      label: 'Quit',
      click: () => {
        menubar.app.quit();
      }
    }
  ]);

  menubar.tray.on('right-click', () => {
    menubar.tray.popUpContextMenu(contextMenu);
  });
});

// Make sure parity stops when UI stops
menubar.app.on('before-quit', killParity);
menubar.app.on('will-quit', killParity);
menubar.app.on('quit', killParity);

menubar.on('ready', createWindow);
