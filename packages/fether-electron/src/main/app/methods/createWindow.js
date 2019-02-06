// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

const { BrowserWindow } = electron;

function createWindow (fetherApp) {
  const {
    createPositioner,
    options,
    setupAppListeners,
    setupMenu,
    setupRequestListeners
  } = fetherApp;

  fetherApp.emit('create-app');

  setupAppListeners(fetherApp);

  fetherApp.emit('create-window');

  fetherApp.win = new BrowserWindow(options);

  if (options.showOnAllWorkspaces !== false) {
    fetherApp.win.setVisibleOnAllWorkspaces(true);
  }

  setupMenu(fetherApp);

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  fetherApp.win.loadURL(options.index);

  createPositioner(fetherApp);
  setupRequestListeners(fetherApp);

  fetherApp.emit('after-create-window');
}

export default createWindow;
