// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { Tray } from 'electron';

function createTray (thatFA) {
  const { app, options } = thatFA;

  if (options.withTaskbar) {
    thatFA.tray = new Tray(options.icon);

    if (process.platform === 'darwin' && app.dock) {
      app.dock.setIcon(options.iconDock);
    }
  }
}

export default createTray;
