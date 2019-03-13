// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import debounce from 'lodash/debounce';

import Pino from '../utils/pino';

const pino = Pino();

function setupWinListeners (fetherApp) {
  const { onWindowClose, processSaveWinPosition, win } = fetherApp;

  // Open external links in browser
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Windows and Linux (unchecked on others)
  win.on('move', () => {
    /**
     * On Linux using this with debouncing is the closest equivalent
     * to using 'moved' (not supported on Linux) with debouncing
     */
    debounce(() => {
      processSaveWinPosition(fetherApp);
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
    pino.info('Detected moved event');
  });

  // macOS and Linux and Windows
  win.on('resize', () => {
    pino.info('Detected resize event');
  });

  win.on('blur', () => {
    fetherApp.emit('blur-window');
  });

  win.on('close', () => {
    onWindowClose(fetherApp);
  });

  win.on('closed', () => {
    fetherApp.win = null;

    fetherApp.emit('after-closed-window');
  });

  win.on('minimize', () => {
    fetherApp.emit('minimize-window');
  });
}

export default setupWinListeners;
