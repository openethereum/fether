// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

const { BrowserWindow } = electron;

function createWindow (thatFA) {
  const { fetherApp } = thatFA;

  const { options } = fetherApp;

  fetherApp.emit('create-app');
  fetherApp.emit('create-window');

  fetherApp.window = new BrowserWindow(options);

  if (options.showOnAllWorkspaces !== false) {
    fetherApp.window.setVisibleOnAllWorkspaces(true);
  }

  if (process.platform !== 'darwin') {
    /**
     * Toggle the Fether menu bar in the frame on Windows. Note that
     * if not shown by default then when it is shown it causes cropping of the bottom
     * of the window when menu open/close toggled. The user will need to be informed
     * that pressing ALT displays the Fether menu
     */
    fetherApp.window.setAutoHideMenuBar(true); // ALT shows menu bar
    fetherApp.window.setMenuBarVisibility(false);
  }

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  fetherApp.window.loadURL(options.index);

  fetherApp.emit('after-create-window');
}

export default createWindow;
