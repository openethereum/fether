// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { promisify } = require('util');
const ps = require('ps-node');

const lookup = promisify(ps.lookup);

/**
 * Detect if another instance of parity is already running or not.
 *
 * @return [Object | Boolean] - If there is another instance, return the
 * instance object. If not return false.
 * @example Here is what's returned when there is an instance running
 * {
 *   pid: '14885',
 *   command: '/Users/amaurymartiny/Workspace/parity/target/release/parity',
 *   arguments: [
 *     '--testnet',
 *     '--no-periodic-snapshot',
 *     '--ws-origins',
 *     'all',
 *     '--light'
 *   ],
 * ppid: '14879'
 * }
 */

const isParityRunning = async () => {
  const results = await lookup({ command: 'parity' });
  return results && results.length ? results[0] : false;
};

module.exports = isParityRunning;
