// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { killParity } from '@parity/electron';
import electron from 'electron';

import FetherWindow from './app';

const { app } = electron;

// Disable gpu acceleration on linux
// https://github.com/parity-js/fether/issues/85
if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration();
}

const fetherWindowInstance = new FetherWindow();

fetherWindowInstance.create();

app.on('ready', fetherWindowInstance.create);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    killParity();
    app.quit();
  }
});

// Make sure parity stops when UI stops
app.on('before-quit', killParity);
app.on('will-quit', killParity);
app.on('quit', killParity);

app.on('activate', () => {
  if (this.fetherWindow === null) {
    fetherWindowInstance.create();
  }
});
