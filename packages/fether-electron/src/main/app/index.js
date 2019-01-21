// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import parityElectron from '@parity/electron';
import electron, { screen, Tray } from 'electron';
import Positioner from 'electron-positioner';
import events from 'events';

import { productName } from '../../../electron-builder.json';
import Pino from './utils/pino';
import { getScreenResolution, shouldFixWindowPosition } from './utils/window';
import {
  getSavedWindowPosition,
  hasSavedWindowPosition,
  saveWindowPosition
} from './settings';
import addMenu from './menu';
import cli from './cli';
import messages from './messages';
import ParityEthereum from './parityEthereum';

const { BrowserWindow, ipcMain, session } = electron;
const pino = Pino();

const withDebug = process.env.DEBUG === 'true';

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
      this.fetherApp.window.setProgressBar(0.4);

      this.loadTaskbar();
      this.fetherApp.window.setProgressBar(0.6);

      this.finalise();
      this.fetherApp.window.setProgressBar(0.8);

      this.showWindow();
      this.fetherApp.window.setProgressBar(1.0);
    } else {
      this.fetherApp.window = new BrowserWindow(options);
      this.fetherApp.window.setProgressBar(0.4);

      // Opens file:///path/to/build/index.html in prod mode, or whatever is
      // passed to ELECTRON_START_URL
      this.fetherApp.window.loadURL(options.index);

      this.debugSetup();

      this.finalise();
      this.fetherApp.window.setProgressBar(1.0);
    }

    this.fetherApp.window.setProgressBar(-1);
    this.fetherApp.emit('after-create-app');

    this.fetherApp.window.on('moved', () => {
      this.processMoved();
    });
  };

  // Enable with `DEBUG=true yarn start` and access Developer Tools
  debugSetup = () => {
    if (withDebug && this.fetherApp.options.webPreferences.devTools) {
      this.fetherApp.window.webContents.openDevTools();
    }
  };

  finalise = () => {
    // Security to prevent window contents from being captured by other apps
    this.fetherApp.window.setContentProtection(true);

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

      this.fetherApp.emit('after-closed-window');
    });

    // Reference: http://robmayhew.com/listening-for-events-from-windows-in-electron-tutorial/

    // Hook WM_SYSCOMMAND
    this.fetherApp.window.hookWindowMessage(
      Number.parseInt('0x0112'),
      (wParam, lParam) => {
        let eventName = null;

        if (wParam.readUInt32LE(0) == 0xf060) {
          // SC_CLOSE
          eventName = 'close';
        } else if (wParam.readUInt32LE(0) == 0xf030) {
          // SC_MAXIMIZE
          eventName = 'maximize';
        } else if (wParam.readUInt32LE(0) == 0xf020) {
          // SC_MINIMIZE
          eventName = 'minimize';
        } else if (wParam.readUInt32LE(0) == 0xf120) {
          // SC_RESTORE
          eventName = 'restored';
        }

        if (eventName !== null) {
          console.log('WINDOWS ' + eventName);
        }
      }
    );

    // WM_EXITSIZEMOVE
    this.fetherApp.window.hookWindowMessage(
      Number.parseInt('0x0232'),
      (wParam, lParam) => {
        console.log('Winodws move or resize complete');
        this.processMoved();
      }
    );
  };

  processMoved = () => {
    const { previousScreenResolution } = this.fetherApp;
    const currentScreenResolution = this.calculateScreenResolution();

    this.fetherApp.previousScreenResolution = getScreenResolution(
      previousScreenResolution,
      currentScreenResolution
    );

    // Get the latest position. The window may have been moved to a different
    // screen with smaller resolution. We must move it to prevent cropping.
    const position = this.fetherApp.window.getPosition();

    const positionStruct = {
      x: position[0],
      y: position[1]
    };

    const fixedWindowPosition = this.fixWindowPosition(positionStruct);

    const newFixedPosition = {
      x: fixedWindowPosition.x || positionStruct.x,
      y: fixedWindowPosition.y || positionStruct.y
    };

    /**
     * Only move it immediately back into the threshold of screen tray bounds
     * if the screen resolution reduced to prevent it from being cropped.
     * Do not call this all the time otherwise it will crash with
     * a call stack exceeded if the user keeps trying to move it outside the screen bounds
     * and it would also prevent the user from moving it to a different screen at all.
     */
    if (
      shouldFixWindowPosition(previousScreenResolution, currentScreenResolution)
    ) {
      // Move window to the fixed x-coordinate position if that required fixing
      if (fixedWindowPosition.x) {
        this.fetherApp.window.setPosition(
          fixedWindowPosition.x,
          positionStruct.y,
          true
        );
      }

      // Move window to the fixed y-coordinate position if that required fixing
      if (fixedWindowPosition.y) {
        this.fetherApp.window.setPosition(
          positionStruct.x,
          fixedWindowPosition.y,
          true
        );
      }
    }

    console.log('newFixedPosition - ', newFixedPosition);
    console.log('positionStruct - ', positionStruct);

    saveWindowPosition(newFixedPosition || positionStruct);

    this.fetherApp.emit('after-moved-window-position-saved');
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

    this.debugSetup();

    this.fetherApp.emit('after-create-window');
  };

  showWindow = trayPos => {
    const { supportsTrayHighlightState, tray } = this.fetherApp;

    if (supportsTrayHighlightState) {
      tray.setHighlightMode('always');
    }

    if (!this.fetherApp.window) {
      this.createWindow();
    }

    this.fetherApp.emit('show-window');

    const calculatedWindowPosition = this.calculateWindowPosition(trayPos);

    console.log('calculatedWindowPosition: ', calculatedWindowPosition);

    const currentScreenResolution = this.calculateScreenResolution();

    // https://ourcodeworld.com/articles/read/285/how-to-get-the-screen-width-and-height-in-electron-framework
    //
    // workAreaSize - dimensions (width and height) of screen without taskbar height
    // scaleFactor - float value scale factor of screen (1 is default without zoom)
    // rotation - if screen orientation is different to 0 (normal)

    const mainScreen = screen.getPrimaryDisplay();
    const allScreens = screen.getAllDisplays();

    console.log('screen mainScreen, allScreens', mainScreen, allScreens);

    const mainScreenDimensions = mainScreen.size;

    console.log(
      'mainScreen dimensions: ',
      mainScreenDimensions.width,
      mainScreenDimensions.height
    );

    const mainScreenScaleFactor = mainScreen.scaleFactor;
    const mainScreenWorkAreaSize = mainScreen.workAreaSize;
    const mainScreenRotation = mainScreen.rotation;

    console.log('mainScreen scaleFactor: ', mainScreenScaleFactor);
    console.log('mainScreen workAreaSize: ', mainScreenWorkAreaSize);
    console.log('mainScreen rotation: ', mainScreenRotation);

    // console.log('getMaximumSize', this.fetherApp.window.getMaximumSize());
    // console.log('getContentSize', this.fetherApp.window.getContentSize());
    // console.log('getContentBounds', this.fetherApp.window.getContentBounds());
    // console.log('getBounds', this.fetherApp.window.getBounds());

    console.log('1aa', calculatedWindowPosition.x);
    console.log('2aa', calculatedWindowPosition.y);
    console.log('3aa', currentScreenResolution.x);
    console.log('4aa', currentScreenResolution.y);
    console.log('5aa', this.fetherApp.window.getSize()[0]);
    console.log('6aa', this.fetherApp.window.getSize()[1]);

    // Depth depends on resolution. Add minimum incase calculations are
    // wrong, for example on a VM with a scaled or resized virtual screen
    // where the VM window screen resolution calculated is actually
    // the width/height of the VM window relative to the host machine screen,
    // rather than the resolution being used in the VM screen.
    let platformDepth = 40; // 'win32'
    if (process.platform === 'darwin') {
      platformDepth = 23;
    }

    // Tray could be on top, bottom, left, or right side of screen
    this.fetherApp.trayDepth = Math.min(
      platformDepth,
      calculatedWindowPosition.x, // Left tray
      calculatedWindowPosition.y, // Top tray
      currentScreenResolution.x -
        calculatedWindowPosition.x +
        this.fetherApp.window.getSize()[0], // Right tray
      currentScreenResolution.y -
        calculatedWindowPosition.y +
        this.fetherApp.window.getSize()[1] // Bottom tray
    );
    // Note: It is calculating the trayDeth incorrectly based
    // on the most recent position, instead of the initial position!
    // Consider storing smallest value in electron-settings.
    // Consider doing Math.min(this.fetherApp.trayDepth, ...) to
    // see if trayDepth already defined upon initial load adjacent
    // to the tray (not subsequent position)
    // this.fetherApp.trayDepth = Math.min(
    //   calculatedWindowPosition.x,
    //   calculatedWindowPosition.y
    // );
    console.log('trayDepth setup: ', this.fetherApp.trayDepth);

    const loadedWindowPosition = hasSavedWindowPosition()
      ? getSavedWindowPosition()
      : undefined;

    const fixedWindowPosition = this.fixWindowPosition(loadedWindowPosition);

    /**
     * Since the user may change the taskbar tray to be on any side of the screen.
     * If the user moved the window out of where the tray would be in the screen resolution bounds.
     * Restore the window so it is fully visible adjacent to where the tray would be.
     */
    const x =
      (fixedWindowPosition && fixedWindowPosition.x) ||
      (loadedWindowPosition && loadedWindowPosition.x) ||
      calculatedWindowPosition.x;

    const y =
      (fixedWindowPosition && fixedWindowPosition.y) ||
      (loadedWindowPosition && loadedWindowPosition.y) ||
      calculatedWindowPosition.y;

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

  /**
   * Proposes a fixed window position that may be used if the window is moved
   * out of the screen bounds threshold. If the window is moved across to a
   * second monitor (without screen mirroring) then if the screen is hidden
   * and then shown again (by pressing the Fether tray icon), since the
   * coordinates of the window are outside the screen bounds the window
   * will be restored into the users primary screen.
   */
  fixWindowPosition = proposedWindowPosition => {
    const { trayDepth } = this.fetherApp;

    if (!proposedWindowPosition) {
      return;
    }

    const newPosition = {
      x: undefined,
      y: undefined
    };

    const currentScreenResolution = this.calculateScreenResolution();

    console.log('currentScreenResolution: ', currentScreenResolution);
    console.log('trayDepth: ', trayDepth);

    if (proposedWindowPosition.x < trayDepth) {
      newPosition.x = trayDepth;
    }

    if (proposedWindowPosition.y < trayDepth) {
      newPosition.y = trayDepth;
    }

    if (proposedWindowPosition.x >= currentScreenResolution.x - trayDepth) {
      newPosition.x = currentScreenResolution.x - trayDepth;
    }

    if (proposedWindowPosition.y >= currentScreenResolution.y - trayDepth) {
      newPosition.y = currentScreenResolution.y - trayDepth;
    }

    return newPosition;
  };

  calculateWindowPosition = trayPos => {
    const { cachedBounds, options, positioner, tray } = this.fetherApp;

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
    console.log('tray.getBounds()', tray.getBounds());

    // Default the window to the right if `trayPos` bounds are undefined or null.
    let noBoundsPosition = null;

    console.log('platform: ', process.platform);

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

    return {
      x: options.x ? options.x : position.x,
      y: options.y ? options.y : position.y
    };
  };

  calculateScreenResolution = () => {
    return {
      x: this.fetherApp.positioner.calculate('bottomRight').x,
      y: this.fetherApp.positioner.calculate('bottomRight').y
    };
  };

  windowClear = () => {
    delete this.fetherApp.window;
    this.fetherApp.emit('after-close-window');
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

    this.fetherApp.on('create-window', () => {
      pino.info('Creating window');
    });

    this.fetherApp.on('after-create-window', () => {
      pino.info('Finished creating window');
    });

    this.fetherApp.on('load-taskbar', () => {
      pino.info('Configuring taskbar for the window');
    });

    this.fetherApp.on('show-window', () => {
      pino.info('Showing window');
    });

    this.fetherApp.on('after-show-window', () => {
      pino.info('Finished showing window');
    });

    this.fetherApp.on('after-create-app', () => {
      pino.info(`Ready to use ${productName}`);
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

    this.fetherApp.on('after-moved-window-position-saved', () => {
      const position = getSavedWindowPosition();

      pino.info(
        `Saved window position to (x: ${position.x}, y: ${
          position.y
        }) after move`
      );
    });

    this.fetherApp.on('after-close-window', () => {
      pino.info('Deleted window upon close');
    });

    this.fetherApp.on('error', error => {
      console.error(error);
    });
  };
}

export default FetherApp;
