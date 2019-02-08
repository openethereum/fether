// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { Tray } from 'electron';

function createTray (fetherApp) {
  const {
    app: { dock },
    options
  } = fetherApp;

  if (options.withTaskbar) {
    fetherApp.tray = new Tray(options.icon);

    if (process.platform === 'darwin' && dock) {
      dock.setIcon(options.iconDock);
    }
  }
}

export default createTray;
