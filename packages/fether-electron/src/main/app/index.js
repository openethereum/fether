// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import events from 'events';

import {
  setupAppListeners,
  createWindow,
  updateProgress,
  createPositioner,
  setupRequestListeners,
  createTray,
  loadTray,
  showTrayBalloon,
  setupDebug,
  setupSecurity,
  setupLogger,
  setupParityEthereum,
  setupGlobals,
  setupMenu,
  getScreenResolution,
  calculateWindowPosition,
  onTrayClick,
  fixWindowPosition,
  showWindow,
  moveWindowUp,
  processSaveWindowPosition,
  hideWindow,
  windowClear,
  onWindowClose,
  setupWindowListeners,
  setupWin32Listeners
} from './methods';

let hasCalledInitFetherApp = false;

class FetherApp {
  fetherApp = new events.EventEmitter();

  constructor (electronApp, options) {
    if (hasCalledInitFetherApp) {
      this.fetherApp.emit(
        'error',
        new Error('Unable to initialise Fether app more than once')
      );
    }

    this.fetherApp.app = electronApp;
    this.fetherApp.options = options;

    // Context of fetherApp passed to each method
    this.fetherApp.setupAppListeners = setupAppListeners(this);
    this.fetherApp.createWindow = createWindow(this);
    this.fetherApp.updateProgress = updateProgress(this);
    this.fetherApp.createPositioner = createPositioner(this);
    this.fetherApp.setupRequestListeners = setupRequestListeners(this);
    this.fetherApp.createTray = createTray(this);
    this.fetherApp.loadTray = loadTray(this);
    this.fetherApp.showTrayBalloon = showTrayBalloon(this);
    this.fetherApp.setupDebug = setupDebug(this);
    this.fetherApp.setupSecurity = setupSecurity(this);
    this.fetherApp.setupLogger = setupLogger();
    this.fetherApp.setupParityEthereum = setupParityEthereum(this);
    this.fetherApp.setupGlobals = setupGlobals();
    this.fetherApp.setupMenu = setupMenu(this);
    this.fetherApp.getScreenResolution = getScreenResolution(this);
    this.fetherApp.calculateWindowPosition = calculateWindowPosition(this);
    this.fetherApp.getScreenResolution = getScreenResolution();
    this.fetherApp.onTrayClick = onTrayClick(this);
    this.fetherApp.fixWindowPosition = fixWindowPosition(this);
    this.fetherApp.getScreenResolution = getScreenResolution(this);
    this.fetherApp.showWindow = showWindow(this);
    this.fetherApp.moveWindowUp = moveWindowUp(this);
    this.fetherApp.processSaveWindowPosition = processSaveWindowPosition(this);
    this.fetherApp.hideWindow = hideWindow(this);
    this.fetherApp.windowClear = windowClear(this);
    this.fetherApp.onWindowClose = onWindowClose();
    this.fetherApp.setupWindowListeners = setupWindowListeners(this);
    this.fetherApp.setupWin32Listeners = setupWin32Listeners(this);

    const { fetherApp } = this;

    fetherApp.setupAppListeners.apply(fetherApp);
    fetherApp.createWindow.apply(fetherApp);
    fetherApp.updateProgress.apply(fetherApp, [0.4]); // eslint-disable-line
    fetherApp.createPositioner.apply(fetherApp);
    fetherApp.setupRequestListeners.apply(fetherApp);
    fetherApp.createTray.apply(fetherApp);
    fetherApp.updateProgress.apply(fetherApp, [0.6]); // eslint-disable-line
    fetherApp.loadTray.apply(fetherApp);
    fetherApp.setupDebug.apply(fetherApp);
    fetherApp.setupSecurity.apply(fetherApp);
    fetherApp.setupLogger.apply();
    fetherApp.setupParityEthereum.apply(fetherApp);
    fetherApp.setupGlobals.apply();
    fetherApp.setupMenu.apply(fetherApp);
    fetherApp.updateProgress.apply(fetherApp, [0.8]); // eslint-disable-line
    fetherApp.showWindow.apply(fetherApp, undefined);
    fetherApp.updateProgress.apply(fetherApp, [1.0]); // eslint-disable-line
    fetherApp.setupWindowListeners.apply(fetherApp);
    fetherApp.setupWin32Listeners.apply(fetherApp);
    fetherApp.updateProgress.apply(fetherApp, [-1, "after-create-app"]); // eslint-disable-line
  }
}

const fetherApp = new FetherApp(app, options);

export default FetherApp;
