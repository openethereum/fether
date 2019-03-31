// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { appIsPackaged } from '../utils/paths';

/**
 * Security. Additional network security is configured after `cli` is available:
 * in fether-electron/src/main/app/options/config/index.js
 *
 * Note: 127.0.0.1 is a trusted loopback and more trustworthy than localhost.
 * See https://letsencrypt.org/docs/certificates-for-localhost/
 */
const DEFAULT_CHAIN = 'kovan';
const DEFAULT_WS_PORT = '8546';
const TRUSTED_LOOPBACK = '127.0.0.1';
const TRUSTED_WS_ORIGINS = 'parity://1.ui.parity';

/**
 * `appIsPackaged` is Electron alternative to using `process.env.NODE_ENV`
 * to determine current environment
 *
 * References:
 * https://github.com/electron-userland/electron-builder/issues/1966
 * https://github.com/electron/electron/issues/7714
 */
const IS_PROD = appIsPackaged;

export {
  DEFAULT_CHAIN,
  DEFAULT_WS_PORT,
  IS_PROD,
  TRUSTED_LOOPBACK,
  TRUSTED_WS_ORIGINS
};
