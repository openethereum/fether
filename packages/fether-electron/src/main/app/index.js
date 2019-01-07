// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import parityElectron from '@parity/electron';
import electron, { Tray } from 'electron';
import Positioner from 'electron-positioner';
import events from 'events';

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
  fetherApp = new events.EventEmitter();

  create = (electronApp, options) => {
    if (hasCalledInitFetherApp) {
      throw new Error('Unable to initialise Fether app more than once');
    }

    pino.info(
      `Starting ${productName} (${
        options.withTaskbar ? 'with' : 'without'
      } taskbar)...`
    );

    this.fetherApp.app = electronApp;
    this.fetherApp.options = options;

    if (this.fetherApp.options.withTaskbar) {
      this.createWindow();
      this.loadTaskbar();
      this.finalise();
    } else {
      this.fetherApp.window = new BrowserWindow(this.fetherApp.options);

      // Opens file:///path/to/build/index.html in prod mode, or whatever is
      // passed to ELECTRON_START_URL
      this.fetherApp.window.loadURL(this.fetherApp.options.index);
      this.finalise();
    }

    this.fetherApp.emit('ready');
  };

  finalise = () => {
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

    // Listen to messages from renderer process
    ipcMain.on('asynchronous-message', (...args) => {
      return messages(this.fetherApp.window, ...args);
    });

    // Add application menu
    addMenu(this.fetherApp.window);
    pino.info('Finished configuring Electron menu');

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
    this.fetherApp.window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      electron.shell.openExternal(url);
    });

    this.fetherApp.window.on('closed', () => {
      this.fetherApp.window = null;
    });
  };

  loadTaskbar = () => {
    pino.info('Configuring Fether taskbar...');

    if (this.fetherApp.app.dock && !this.fetherApp.options.showDockIcon) {
      this.fetherApp.app.dock.hide();
    }

    const defaultClickEvent = this.fetherApp.options.showOnRightClick
      ? 'right-click'
      : 'click';

    this.fetherApp.tray = new Tray(this.fetherApp.options.icon);
    this.fetherApp.tray.on(defaultClickEvent, this.clickedTray);
    this.fetherApp.tray.on('double-click', this.clickedTray);
    this.fetherApp.tray.setToolTip(this.fetherApp.options.tooltip);

    this.fetherApp.supportsTrayHighlightState = false;

    try {
      this.fetherApp.tray.setHighlightMode('never');
      this.fetherApp.supportsTrayHighlightState = true;
    } catch (e) {
      console.error('Unable to set highlight mode: ', e);
    }
  };

  createWindow = () => {
    pino.info('Creating Fether window');

    this.fetherApp.emit('create-window');

    this.fetherApp.window = new BrowserWindow(this.fetherApp.options);
    this.fetherApp.positioner = new Positioner(this.fetherApp.window);

    this.fetherApp.window.on('blur', () => {
      this.fetherApp.options.alwaysOnTop ? this.emitBlur() : this.hideWindow();
    });

    if (this.fetherApp.options.showOnAllWorkspaces !== false) {
      this.fetherApp.window.setVisibleOnAllWorkspaces(true);
    }

    this.fetherApp.window.on('close', this.windowClear);

    this.fetherApp.window.loadURL(this.fetherApp.options.index);

    this.fetherApp.emit('after-create-window');
  };

  showWindow = trayPos => {
    pino.info('Showing Fether window');

    if (this.fetherApp.supportsTrayHighlightState) {
      this.fetherApp.tray.setHighlightMode('always');
    }

    if (!this.fetherApp.window) {
      this.createWindow();
    }

    this.fetherApp.emit('show');

    if (trayPos && trayPos.x !== 0) {
      // Cache the bounds
      this.fetherApp.cachedBounds = trayPos;
    } else if (this.fetherApp.cachedBounds) {
      // Cached value will be used if showWindow is called without bounds data
      trayPos = this.fetherApp.cachedBounds;
    } else if (this.fetherApp.tray.getBounds) {
      // Get the current tray bounds
      trayPos = this.fetherApp.tray.getBounds();
    }

    // Default the window to the right if `trayPos` bounds are undefined or null.
    let noBoundsPosition = null;

    if (
      (trayPos === undefined || (trayPos && trayPos.x === 0)) &&
      this.fetherApp.options.windowPosition &&
      this.fetherApp.options.windowPosition.substr(0, 4) === 'tray'
    ) {
      noBoundsPosition =
        process.platform === 'win32' ? 'bottomRight' : 'topRight';
    }

    const position = this.fetherApp.positioner.calculate(
      noBoundsPosition || this.fetherApp.options.windowPosition,
      trayPos
    );

    const x =
      this.fetherApp.options.x !== undefined
        ? this.fetherApp.options.x
        : position.x;
    const y =
      this.fetherApp.options.y !== undefined
        ? this.fetherApp.options.y
        : position.y;

    this.fetherApp.window.setPosition(x, y);
    this.fetherApp.window.show();

    this.fetherApp.emit('after-show');
  };

  hideWindow = () => {
    if (this.fetherApp.supportsTrayHighlightState) {
      this.fetherApp.tray.setHighlightMode('never');
    }

    if (!this.fetherApp.window) {
      return;
    }

    this.fetherApp.emit('hide');
    this.fetherApp.window.hide();
    this.fetherApp.emit('after-hide');
  };

  windowClear = () => {
    delete this.fetherApp.window;
    this.fetherApp.emit('after-close');
  };

  emitBlur = () => {
    this.fetherApp.emit('focus-lost');
  };

  clickedTray = (e, bounds) => {
    if (
      e.altKey ||
      e.shiftKey ||
      e.ctrlKey ||
      e.metaKey ||
      (this.fetherApp.window && this.fetherApp.window.isVisible())
    ) {
      return this.hideWindow();
    }

    // cachedBounds are needed for double-clicked event
    this.fetherApp.cachedBounds = bounds || this.fetherApp.cachedBounds;
    this.showWindow(this.fetherApp.cachedBounds);
  };
}

export default FetherApp;
