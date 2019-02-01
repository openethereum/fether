// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import debounce from 'lodash/debounce';

import Pino from '../utils/pino';

const pino = Pino();

function setupWindowListeners () {
  // Open external links in browser
  this.fetherApp.window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Linux (unchecked on others)
  this.fetherApp.window.on('move', () => {
    /**
     * On Linux using this with debouncing is the closest equivalent
     * to using 'moved' (not supported on Linux) with debouncing
     */
    debounce(() => {
      this.processSaveWindowPosition();
    }, 1000);
  });

  // macOS (not Windows or Linux)
  this.fetherApp.window.on('moved', () => {
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
    this.processSaveWindowPosition();
  });

  // macOS and Linux (not Windows)
  this.fetherApp.window.on('resize', () => {
    pino.info('Detected resize event');
    this.moveWindowUp();
    setTimeout(() => {
      this.moveWindowUp();
    }, 5000);
  });

  this.fetherApp.window.on('blur', () => {
    this.fetherApp.options.alwaysOnTop
      ? this.fetherApp.emit('blur-window')
      : this.hideWindow();
  });

  this.fetherApp.window.on('close', () => {
    this.onWindowClose();
  });

  this.fetherApp.window.on('closed', () => {
    this.fetherApp.window = null;

    this.fetherApp.emit('after-closed-window');
  });
}

export default setupWindowListeners;
