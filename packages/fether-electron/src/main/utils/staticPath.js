// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* global __static */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get the path to the `static` folder.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 */
const staticPath = isDevelopment
  ? __static
  : __dirname.replace(/app\.asar$/, 'static');

export default staticPath;
