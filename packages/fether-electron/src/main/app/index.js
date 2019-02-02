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
  }
}

FetherApp.prototype.setupAppListeners = setupAppListeners;
FetherApp.prototype.createWindow = createWindow;
FetherApp.prototype.updateProgress = updateProgress;
FetherApp.prototype.createPositioner = createPositioner;
FetherApp.prototype.setupRequestListeners = setupRequestListeners;
FetherApp.prototype.createTray = createTray;
FetherApp.prototype.loadTray = loadTray;
FetherApp.prototype.showTrayBalloon = showTrayBalloon;
FetherApp.prototype.setupDebug = setupDebug;
FetherApp.prototype.setupSecurity = setupSecurity;
FetherApp.prototype.setupLogger = setupLogger;
FetherApp.prototype.setupParityEthereum = setupParityEthereum;
FetherApp.prototype.setupGlobals = setupGlobals;
FetherApp.prototype.setupMenu = setupMenu;
FetherApp.prototype.getScreenResolution = getScreenResolution;
FetherApp.prototype.calculateWindowPosition = calculateWindowPosition;
FetherApp.prototype.onTrayClick = onTrayClick;
FetherApp.prototype.fixWindowPosition = fixWindowPosition;
FetherApp.prototype.showWindow = showWindow;
FetherApp.prototype.moveWindowUp = moveWindowUp;
FetherApp.prototype.processSaveWindowPosition = processSaveWindowPosition;
FetherApp.prototype.hideWindow = hideWindow;
FetherApp.prototype.windowClear = windowClear;
FetherApp.prototype.onWindowClose = onWindowClose;
FetherApp.prototype.setupWindowListeners = setupWindowListeners;
FetherApp.prototype.setupWin32Listeners = setupWin32Listeners;

const createFetherApp = (app, options) => {
  const fetherApp = new FetherApp(app, options);

  // Context of fetherApp passed to each method
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
  fetherApp.setupLogger.apply(fetherApp);
  fetherApp.setupParityEthereum.apply(fetherApp);
  fetherApp.setupGlobals.apply(fetherApp);
  fetherApp.setupMenu.apply(fetherApp);
  fetherApp.updateProgress.apply(fetherApp, [0.8]); // eslint-disable-line
  fetherApp.showWindow.apply(fetherApp, undefined);
  fetherApp.updateProgress.apply(fetherApp, [1.0]); // eslint-disable-line
  fetherApp.setupWindowListeners.apply(fetherApp);
  fetherApp.setupWin32Listeners.apply(fetherApp);
  fetherApp.updateProgress.apply(fetherApp, [-1, "after-create-app"]); // eslint-disable-line
};

export default createFetherApp;
