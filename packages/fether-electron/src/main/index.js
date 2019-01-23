// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { killParity } from '@parity/electron';
import electron from 'electron';

import Pino from './app/utils/pino';
import FetherApp from './app';
import FetherAppOptions from './app/options';

const { app } = electron;
const pino = Pino();

let withTaskbar = process.env.TASKBAR !== 'false';

// Disable gpu acceleration on linux
// https://github.com/parity-js/fether/issues/85
if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration();

  // Disable taskbar on Linux (since not supported by Gnome 3)
  withTaskbar = false;
}

const fetherAppInstance = new FetherApp();
const fetherAppOptionsInstance = new FetherAppOptions();
const options = fetherAppOptionsInstance.create(withTaskbar, {});

app.on('ready', () => {
  fetherAppInstance.create(app, options);
});

// Event triggered by clicking the Electron icon in the menu Dock
// Reference: https://electronjs.org/docs/api/app#event-activate-macos
app.on('activate', (event, hasVisibleWindows) => {
  if (withTaskbar) {
    pino.info(
      'Detected Fether taskbar mode. Launching from application dock is not permitted.'
    );
    return;
  }

  if (hasVisibleWindows) {
    pino.info('Existing Fether window detected.');
    return;
  }

  fetherAppInstance.create(app, options);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    killParity();
    app.quit();
  }
});

// Make sure Parity Ethereum stops when UI stops
app.on('before-quit', killParity);

app.on('will-quit', killParity);

app.on('quit', () => {
  pino.info('Leaving Fether');
  killParity();
});
