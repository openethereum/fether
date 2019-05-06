// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import EventEmitter from 'events';

import {
  calculateWinPosition,
  createPositioner,
  createTray,
  createWindow,
  fixWinPosition,
  getScreenResolution,
  hideWindow,
  loadTray,
  moveWindowUp,
  onTrayClick,
  onWindowClose,
  processSaveWinPosition,
  setupAppListeners,
  setupDebug,
  setupGlobals,
  setupLogger,
  setupMenu,
  setupParityEthereum,
  setupRequestListeners,
  setupSecurity,
  setupWinListeners,
  setupWin32Listeners,
  showTrayBalloon,
  showWindow,
  updateProgress,
  windowClear
} from './methods';

let hasCalledInitFetherApp = false;

class FetherApp extends EventEmitter {
  constructor (electronApp, options) {
    super();

    if (hasCalledInitFetherApp) {
      this.emit(
        'error',
        new Error('Unable to initialise Fether app more than once')
      );
    }

    /**
     * After the Fether instance and fetherApp.win has been created.
     * If the user then chooses from the Fether Menu "Window > Close"
     * it runs windowClear, which deletes fetherApp.win and associated
     * listeners since the 'close' event also occurs when the user exits.
     * If the user then clicks the tray icon to re-open the Fether window,
     * it will run the onTrayClick method, which calls fetherApp.showWindow
     * and if fetherApp.win does not exist, it runs showWindow and createWindow
     * to restore create fetherApp.win again and associated listeners. However we
     * do not need to run all the fetherApp methods again like we did on the
     * when fetherApp.win was first created (i.e. createTray, loadTray,
     * setupDebug, setupSecurity, setupLogger, setupParityEthereum, setupGlobals)
     */
    this.app = electronApp;
    this.options = options;

    this.createWindow();
    this.updateProgress(0.4, undefined);

    // These methods are called only once when Fether instance is created
    // (i.e. not called again when the Fether window closed and re-opened)
    this.createTray();
    this.loadTray();
    this.setupDebug();
    this.setupSecurity();
    this.setupLogger();
    this.setupParityEthereum();
    this.setupGlobals();

    this.updateProgress(0.8, undefined);
    this.showWindow(undefined);
    this.updateProgress(1.0, undefined);
    this.updateProgress(-1, 'after-create-app');
  }

  calculateWinPosition = () => calculateWinPosition(this);
  createPositioner = () => createPositioner(this);
  createTray = () => createTray(this);
  createWindow = () => createWindow(this);
  fixWinPosition = positionStruct => fixWinPosition(this, positionStruct);
  getScreenResolution = () => getScreenResolution();
  hideWindow = () => hideWindow(this);
  loadTray = () => loadTray(this);
  moveWindowUp = () => moveWindowUp(this);
  onTrayClick = (e, bounds) => onTrayClick(this, e, bounds);
  onWindowClose = () => onWindowClose(this);
  processSaveWinPosition = () => processSaveWinPosition(this);
  setupAppListeners = () => setupAppListeners(this);
  setupDebug = () => setupDebug(this);
  setupGlobals = () => setupGlobals();
  setupLogger = () => setupLogger();
  setupMenu = () => setupMenu(this);
  setupParityEthereum = () => setupParityEthereum(this);
  setupRequestListeners = () => setupRequestListeners(this);
  setupSecurity = () => setupSecurity(this);
  setupWinListeners = () => setupWinListeners(this);
  setupWin32Listeners = () => setupWin32Listeners(this);
  showTrayBalloon = () => showTrayBalloon(this);
  showWindow = trayPos => showWindow(this, trayPos);
  updateProgress = (percentage, eventListenerName) =>
    updateProgress(this, percentage, eventListenerName);
  windowClear = () => windowClear(this);
}

export default FetherApp;
