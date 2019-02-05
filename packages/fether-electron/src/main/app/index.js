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

    this.app = electronApp;
    this.options = options;

    this.setupAppListeners();
    this.createWindow();
    this.updateProgress(0.4, undefined); // eslint-disable-line
    this.createPositioner();
    this.setupRequestListeners();
    this.createTray();
    this.updateProgress(0.6, undefined); // eslint-disable-line
    this.loadTray();
    this.setupDebug();
    this.setupSecurity();
    this.setupLogger.apply();
    this.setupParityEthereum();
    this.setupGlobals();
    this.setupMenu();
    this.updateProgress(0.8, undefined); // eslint-disable-line
    this.showWindow(undefined);
    this.updateProgress(1.0, undefined); // eslint-disable-line
    this.setupWindowListeners();
    this.setupWin32Listeners();
    this.updateProgress(-1, "after-create-app"); // eslint-disable-line
  }

  setupAppListeners = () => setupAppListeners(this);
  createWindow = () => createWindow(this);
  updateProgress = (percentage, eventListenerName) =>
    updateProgress(this, percentage, eventListenerName);
  createPositioner = () => createPositioner(this);
  setupRequestListeners = () => setupRequestListeners(this);
  createTray = () => createTray(this);
  loadTray = () => loadTray(this);
  showTrayBalloon = () => showTrayBalloon(this);
  setupDebug = () => setupDebug(this);
  setupSecurity = () => setupSecurity(this);
  setupLogger = () => setupLogger();
  setupParityEthereum = () => setupParityEthereum(this);
  setupGlobals = () => setupGlobals();
  setupMenu = () => setupMenu(this);
  getScreenResolution = () => getScreenResolution(this);
  calculateWindowPosition = () => calculateWindowPosition(this);
  getScreenResolution = () => getScreenResolution();
  onTrayClick = (e, bounds) => onTrayClick(this, e, bounds);
  fixWindowPosition = positionStruct => fixWindowPosition(this, positionStruct);
  getScreenResolution = () => getScreenResolution(this);
  showWindow = trayPos => showWindow(this, trayPos);
  moveWindowUp = () => moveWindowUp(this);
  processSaveWindowPosition = () => processSaveWindowPosition(this);
  hideWindow = () => hideWindow(this);
  windowClear = () => windowClear(this);
  onWindowClose = () => onWindowClose();
  setupWindowListeners = () => setupWindowListeners(this);
  setupWin32Listeners = () => setupWin32Listeners(this);
}

export default FetherApp;
