// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import debounce from 'lodash/debounce';

import Pino from '../utils/pino';

const pino = Pino();

function setupWinListeners (fetherApp) {
  const {
    hideWindow,
    moveWindowUp,
    onWindowClose,
    options,
    processSaveWinPosition,
    win
  } = fetherApp;

  // Open external links in browser
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Linux (unchecked on others)
  win.on('move', () => {
    /**
     * On Linux using this with debouncing is the closest equivalent
     * to using 'moved' (not supported on Linux) with debouncing
     */
    debounce(() => {
      processSaveWinPosition();
    }, 1000);
  });

  // macOS (not Windows or Linux)
  win.on('moved', () => {
    /**
     * On macOS save the position in the 'moved' event since if
     * we run it just in 'close' instead, then if the Fether app
     * crashes after they've moved the Fether window then it won't run
     * 'close' and it won't save the window position.
     *
     * On Windows we use the equivalent WM_EXITSIZEMOVE that detects
     * the equivalent of 'moved'
     *
     * On Linux the closest equivalent to achieving 'moved' is debouncing
     * on the 'move' event. It also works in 'close' even when app crashes
     */
    processSaveWinPosition();
  });

  // macOS and Linux (not Windows)
  win.on('resize', () => {
    pino.info('Detected resize event');

    moveWindowUp();
    setTimeout(() => {
      moveWindowUp();
    }, 5000);
  });

  win.on('blur', () => {
    options.alwaysOnTop ? fetherApp.emit('blur-window') : hideWindow();
  });

  win.on('close', () => {
    onWindowClose();
  });

  win.on('closed', () => {
    fetherApp.win = null;

    fetherApp.emit('after-closed-window');
  });
}

export default setupWinListeners;
