// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* global __static */

import electron from 'electron';
import path from 'path';
import url from 'url';

import addMenu from './menu';
import { doesParityExist } from './operations/doesParityExist';
import fetchParity from './operations/fetchParity';
import handleError from './operations/handleError';
import messages from './messages';
import { productName } from '../../electron-builder.json';
import Pino from './utils/pino';
import { runParity, killParity } from './operations/runParity';

const { app, BrowserWindow, ipcMain, session } = electron;
let mainWindow;
const pino = Pino();

function createWindow () {
  pino.info(`Starting ${productName}...`);
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200
  });

  doesParityExist()
    .catch(() => fetchParity(mainWindow)) // Install parity if not present
    .then(() => runParity(mainWindow))
    .catch(handleError); // Errors should be handled before, this is really just in case

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__static, 'build', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
  );

  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', messages);

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
