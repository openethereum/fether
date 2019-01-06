// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import parityElectron from '@parity/electron';
import electron from 'electron';

import { productName } from '../../../electron-builder.json';
import Pino from './utils/pino';
import addMenu from './menu';
import cli from './cli';
import messages from './messages';
import ParityEthereum from './parityEthereum';

const { BrowserWindow, ipcMain, session } = electron;
const pino = Pino();

let hasCalledInitFetherApp = false;

class FetherApp {
  fetherApp = {};

  create = options => {
    if (hasCalledInitFetherApp) {
      throw new Error('Unable to initialise Fether app more than once');
    }

    pino.info(`Starting ${productName}...`);
    this.fetherApp.window = new BrowserWindow(options);

    // Set options for @parity/electron
    parityElectron({
      logger: namespace => log => Pino({ name: namespace }).info(log)
    });

    // Download, install, and run Parity Ethereum if not running and requested
    const parityEthereumInstance = new ParityEthereum();
    parityEthereumInstance.setup(this.fetherApp.window);

    // Globals for fether-react parityStore
    global.wsInterface = cli.wsInterface;
    global.wsPort = cli.wsPort;

    // Opens file:///path/to/build/index.html in prod mode, or whatever is
    // passed to ELECTRON_START_URL
    this.fetherApp.window.loadURL(options.index);

    // Listen to messages from renderer process
    ipcMain.on('asynchronous-message', (...args) =>
      messages(this.fetherApp.window, ...args)
    );

    // Add application menu
    addMenu(this.fetherApp.window);

    // WS calls have Origin `file://` by default, which is not trusted.
    // We override Origin header on all WS connections with an authorized one.
    session.defaultSession.webRequest.onBeforeSendHeaders(
      {
        urls: ['ws://*/*', 'wss://*/*']
      },
      (details, callback) => {
        if (!this.fetherApp.window) {
          // There might be a split second where the user closes the app, so
          // this.fetherApp.window is null, but there is still a network request done.
          return;
        }
        details.requestHeaders.Origin = `parity://${
          this.fetherApp.window.id
        }.ui.parity`;
        callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
      }
    );

    // Open external links in browser
    this.fetherApp.window.webContents.on('new-window', function (event, url) {
      event.preventDefault();
      electron.shell.openExternal(url);
    });

    this.fetherApp.window.on('closed', () => {
      this.fetherApp.window = null;
    });
  };
}

export default FetherApp;
