// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import cli from '../cli';

import Pino from '../utils/pino';

const pino = Pino();

// pino.info('QQQQQQQ', cli.wsPort);

/**
 * Note: 127.0.0.1 is more trustworthy than localhost.
 * See https://letsencrypt.org/docs/certificates-for-localhost/
 *
 * Note: If the user provides a custom CLI port we 'dynamically' trust it as well
 * as the `DEFAULT_WS_PORT` in fether-electron/src/main/index.js where we only
 * permit requests from trusted paths. It also disallows users from using Fether
 * with a remote node. SSH tunnels are still possible.
 */
const DEFAULT_CHAIN = 'kovan';
const DEFAULT_WS_PORT = '8546';
const TRUSTED_LOOPBACK = '127.0.0.1';
const TRUSTED_LOOPBACK_PREFIX = `http://${TRUSTED_LOOPBACK}`;
const TRUSTED_HOSTS = ['api.github.com', 'github.com'];
const TRUSTED_URLS = [
  `${TRUSTED_LOOPBACK_PREFIX}:3000`,
  `ws://${TRUSTED_LOOPBACK}`,
  'https://parity.io',
  'https://github.com/paritytech/fether/issues/new',
  'https://api.github.com/repos/paritytech/fether/releases/latest'
];

const TRUSTED_WS_PORTS = [DEFAULT_WS_PORT];

export {
  DEFAULT_CHAIN,
  DEFAULT_WS_PORT,
  TRUSTED_HOSTS,
  TRUSTED_LOOPBACK,
  TRUSTED_LOOPBACK_PREFIX,
  TRUSTED_URLS,
  TRUSTED_WS_PORTS
};
