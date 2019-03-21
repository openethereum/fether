// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* global __static */

import path from 'path';

const appIsPackaged = !process.defaultApp;

/**
 * Get the path to the `static` folder.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 */
const staticPath = appIsPackaged
  ? __dirname.replace(/app\.asar$/, 'static')
  : __static;

/**
 * Get the path to the bundled Parity Ethereum binary.
 */
const bundledParityPath =
  process.platform === 'win32'
    ? path.join(staticPath, 'parity.exe')
    : path.join(staticPath, 'parity');

export { staticPath, bundledParityPath };
