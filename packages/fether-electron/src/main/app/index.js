// Copyright 2015-2018 Parity Technologies (UK) Ltd.
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
  // fetherApp = new events.EventEmitter();

  constructor (electronApp, options) {
    super();

    if (hasCalledInitFetherApp) {
      this.emit(
        'error',
        new Error('Unable to initialise Fether app more than once')
      );
    }

    this.app = electronApp;
    this.options = options;

    this.setupAppListeners();
    this.createWindow();
    this.updateProgress(0.4, undefined);
    this.createPositioner();
    this.setupRequestListeners();
    this.createTray();
    this.updateProgress(0.6, undefined);
    this.loadTray();
    this.setupDebug();
    this.setupSecurity();
    this.setupLogger.apply();
    this.setupParityEthereum();
    this.setupGlobals();
    this.setupMenu();
    this.updateProgress(0.8, undefined);
    this.showWindow(undefined);
    this.updateProgress(1.0, undefined);
    this.setupWinListeners();
    this.setupWin32Listeners();
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
  onWindowClose = () => onWindowClose();
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
