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
      this.fetherApp.emit(
        'error',
        new Error('Unable to initialise Fether app more than once')
      );
    }

    this.fetherApp.app = electronApp;
    this.fetherApp.options = options;

    this.addListeners();

    this.fetherApp.emit('create-app');

    if (options.withTaskbar) {
      this.createWindow();
      this.loadTaskbar();
      this.finalise();
    } else {
      this.fetherApp.window = new BrowserWindow(options);

      // Opens file:///path/to/build/index.html in prod mode, or whatever is
      // passed to ELECTRON_START_URL
      this.fetherApp.window.loadURL(options.index);
      this.finalise();
    }

    this.fetherApp.emit('after-create-app');
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
          // this.fether.window is null, but there is still a network request done.
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

      this.fetherApp.emit('closed-window');
    });
  };

  loadTaskbar = () => {
    const { app, options } = this.fetherApp;

    this.fetherApp.emit('load-taskbar');

    if (app.dock && !options.showDockIcon) {
      app.dock.hide();
    }

    const defaultClickEvent = options.showOnRightClick
      ? 'right-click'
      : 'click';

    this.fetherApp.tray = new Tray(options.icon);
    let { tray } = this.fetherApp;

    tray.on(defaultClickEvent, this.clickedTray);
    tray.on('double-click', this.clickedTray);
    tray.setToolTip(options.tooltip);

    this.fetherApp.supportsTrayHighlightState = false;

    try {
      tray.setHighlightMode('never');
      this.fetherApp.supportsTrayHighlightState = true;
    } catch (e) {
      console.error('Unable to set highlight mode: ', e);
    }
  };

  createWindow = () => {
    const { options } = this.fetherApp;

    this.fetherApp.emit('create-window');

    this.fetherApp.window = new BrowserWindow(options);
    this.fetherApp.positioner = new Positioner(this.fetherApp.window);

    this.fetherApp.window.on('blur', () => {
      options.alwaysOnTop ? this.emitBlur() : this.hideWindow();
    });

    if (options.showOnAllWorkspaces !== false) {
      this.fetherApp.window.setVisibleOnAllWorkspaces(true);
    }

    this.fetherApp.window.on('close', this.windowClear);

    this.fetherApp.window.loadURL(options.index);

    this.fetherApp.emit('after-create-window');
  };

  showWindow = trayPos => {
    const {
      cachedBounds,
      options,
      positioner,
      supportsTrayHighlightState,
      tray
    } = this.fetherApp;

    if (supportsTrayHighlightState) {
      tray.setHighlightMode('always');
    }

    if (!this.fetherApp.window) {
      this.createWindow();
    }

    this.fetherApp.emit('show-window');

    if (trayPos && trayPos.x !== 0) {
      // Cache the bounds
      this.fetherApp.cachedBounds = trayPos;
    } else if (cachedBounds) {
      // Cached value will be used if showWindow is called without bounds data
      trayPos = cachedBounds;
    } else if (tray.getBounds) {
      // Get the current tray bounds
      trayPos = tray.getBounds();
    }

    // Default the window to the right if `trayPos` bounds are undefined or null.
    let noBoundsPosition = null;

    if (
      (trayPos === undefined || (trayPos && trayPos.x === 0)) &&
      options.windowPosition &&
      options.windowPosition.substr(0, 4) === 'tray'
    ) {
      noBoundsPosition =
        process.platform === 'win32' ? 'bottomRight' : 'topRight';
    }

    const position = positioner.calculate(
      noBoundsPosition || options.windowPosition,
      trayPos
    );

    const x = options.x ? options.x : position.x;
    const y = options.y ? options.y : position.y;

    this.fetherApp.window.setPosition(x, y);
    this.fetherApp.window.show();

    this.fetherApp.emit('after-show-window');
  };

  hideWindow = () => {
    const { supportsTrayHighlightState, tray } = this.fetherApp;

    if (supportsTrayHighlightState) {
      tray.setHighlightMode('never');
    }

    if (!this.fetherApp.window) {
      return;
    }

    this.fetherApp.emit('hide-window');
    this.fetherApp.window.hide();
    this.fetherApp.emit('after-hide-window');
  };

  windowClear = () => {
    delete this.fetherApp.window;
    this.fetherApp.emit('after-window-close');
  };

  emitBlur = () => {
    this.fetherApp.emit('blur-window');
  };

  clickedTray = (e, bounds) => {
    const { cachedBounds, window } = this.fetherApp;

    if (
      e.altKey ||
      e.shiftKey ||
      e.ctrlKey ||
      e.metaKey ||
      (window && window.isVisible())
    ) {
      return this.hideWindow();
    }

    // cachedBounds are needed for double-clicked event
    this.fetherApp.cachedBounds = bounds || cachedBounds;
    this.showWindow(this.fetherApp.cachedBounds);
  };

  addListeners = () => {
    this.fetherApp.on('create-app', () => {
      pino.info(
        `Starting ${productName} (${
          this.fetherApp.options.withTaskbar ? 'with' : 'without'
        } taskbar)...`
      );
    });

    this.fetherApp.on('after-create-app', () => {
      pino.info(`Ready to use ${productName}`);
    });

    this.fetherApp.on('create-window', () => {
      pino.info('Creating window');
    });

    this.fetherApp.on('after-create-window', () => {
      pino.info('Finished creating window');
    });

    this.fetherApp.on('show-window', () => {
      pino.info('Showing window');
    });

    this.fetherApp.on('after-show-window', () => {
      pino.info('Finished showing window');
    });

    this.fetherApp.on('hide-window', () => {
      pino.info('Hiding window on blur since not on top');
    });

    this.fetherApp.on('after-hide-window', () => {
      pino.info('Finished hiding window');
    });

    this.fetherApp.on('blur-window', () => {
      pino.info('Blur window since lost focus when on top');
    });

    this.fetherApp.on('after-closed-window', () => {
      pino.info('Reset window since it was closed');
    });

    this.fetherApp.on('after-close-window', () => {
      pino.info('Deleted window upon close');
    });

    this.fetherApp.on('load-taskbar', () => {
      pino.info('Configuring taskbar for the window');
    });

    this.fetherApp.on('error', error => {
      console.error(error);
    });
  };
}

export default FetherApp;
