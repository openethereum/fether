// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import debounce from 'lodash/debounce';

import Pino from '../utils/pino';

const pino = Pino();

function setupWindowListeners (thatFA) {
  const { fetherApp } = thatFA;

  // Open external links in browser
  thatFA.window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Linux (unchecked on others)
  thatFA.window.on('move', () => {
    /**
     * On Linux using this with debouncing is the closest equivalent
     * to using 'moved' (not supported on Linux) with debouncing
     */
    debounce(() => {
      thatFA.processSaveWindowPosition();
    }, 1000);
  });

  // macOS (not Windows or Linux)
  thatFA.window.on('moved', () => {
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
    thatFA.processSaveWindowPosition();
  });

  // macOS and Linux (not Windows)
  thatFA.window.on('resize', () => {
    pino.info('Detected resize event');
    thatFA.moveWindowUp();
    setTimeout(() => {
      thatFA.moveWindowUp();
    }, 5000);
  });

  thatFA.window.on('blur', () => {
    thatFA.options.alwaysOnTop
      ? fetherApp.emit('blur-window')
      : thatFA.hideWindow();
  });

  thatFA.window.on('close', () => {
    thatFA.onWindowClose();
  });

  thatFA.window.on('closed', () => {
    thatFA.window = null;

    fetherApp.emit('after-closed-window');
  });
}

export default setupWindowListeners;
