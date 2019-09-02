// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import cli from 'commander';

import { DEFAULT_CHAIN } from '../constants';

const { productName } = require('../../../../electron-builder.json');
const { version } = require('../../../../package.json');

/**
 * Process.argv arguments length is different in electron mode and in packaged
 * mode. This small line is to harmonize the behavior for consistent parsing.
 *
 * @see https://github.com/tj/commander.js/issues/512
 * @see https://github.com/electron/electron/issues/4690#issuecomment-217435222
 */
if (process.defaultApp !== true) {
  process.argv.unshift('');
}

cli
  .version(version)
  .option(
    '--chain <chain>',
    `The network to connect to, can be one of "foundation", "kovan" or "ropsten". (default: "${DEFAULT_CHAIN}")`,
    DEFAULT_CHAIN
  )
  .option(
    '--no-run-parity',
    `${productName} will not attempt to run the locally installed parity.`
  )
  .parse(process.argv);

export default cli;
