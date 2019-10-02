// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import path from 'path';

const { app } = electron;
const IS_TEST = !app;
const IS_PACKAGED = !IS_TEST && app.isPackaged;

const IPC_PATH =
  process.platform === 'win32'
    ? path.join(
      '\\\\?\\pipe',
      electron.app.getPath('userData'),
      'fether-parity-ipc.ipc'
    )
    : path.join(electron.app.getPath('userData'), 'fether-parity-ipc.ipc');

/**
 * Get the path to the `static` folder.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 */
const staticPath = IS_PACKAGED
  ? __dirname.replace(/app\.asar$/, 'static')
  : path.join(process.cwd(), 'static');

/**
 * Get the path to the bundled Parity Ethereum binary.
 */
const bundledParityPath =
  process.platform === 'win32'
    ? path.join(staticPath, 'parity.exe')
    : path.join(staticPath, 'parity');

export { IS_PACKAGED, IPC_PATH, bundledParityPath, staticPath };
