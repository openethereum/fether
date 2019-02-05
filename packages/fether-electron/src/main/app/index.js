// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import events from 'events';

import {
  calculateWindowPosition,
  createPositioner,
  createTray,
  createWindow,
  fixWindowPosition,
  getScreenResolution,
  hideWindow,
  loadTray,
  moveWindowUp,
  onTrayClick,
  onWindowClose,
  processSaveWindowPosition,
  setupAppListeners,
  setupDebug,
  setupGlobals,
  setupLogger,
  setupMenu,
  setupParityEthereum,
  setupRequestListeners,
  setupSecurity,
  setupWindowListeners,
  setupWin32Listeners,
  showTrayBalloon,
  showWindow,
  updateProgress,
  windowClear
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

  calculateWindowPosition = () => calculateWindowPosition(this);
  createPositioner = () => createPositioner(this);
  createTray = () => createTray(this);
  createWindow = () => createWindow(this);
  fixWindowPosition = positionStruct => fixWindowPosition(this, positionStruct);
  getScreenResolution = () => getScreenResolution();
  hideWindow = () => hideWindow(this);
  loadTray = () => loadTray(this);
  moveWindowUp = () => moveWindowUp(this);
  onTrayClick = (e, bounds) => onTrayClick(this, e, bounds);
  onWindowClose = () => onWindowClose();
  processSaveWindowPosition = () => processSaveWindowPosition(this);
  setupAppListeners = () => setupAppListeners(this);
  setupDebug = () => setupDebug(this);
  setupGlobals = () => setupGlobals();
  setupLogger = () => setupLogger();
  setupMenu = () => setupMenu(this);
  setupParityEthereum = () => setupParityEthereum(this);
  setupRequestListeners = () => setupRequestListeners(this);
  setupSecurity = () => setupSecurity(this);
  setupWindowListeners = () => setupWindowListeners(this);
  setupWin32Listeners = () => setupWin32Listeners(this);
  showTrayBalloon = () => showTrayBalloon(this);
  showWindow = trayPos => showWindow(this, trayPos);
  updateProgress = (percentage, eventListenerName) =>
    updateProgress(this, percentage, eventListenerName);
  windowClear = () => windowClear(this);
}

export default FetherApp;
