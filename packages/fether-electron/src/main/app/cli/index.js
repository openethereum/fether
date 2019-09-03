// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import cli from 'commander';

import { DEFAULT_CHAIN, DEFAULT_WS_PORT } from '../constants';

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
  .allowUnknownOption()
  .option(
    '--chain <chain>',
    `The network to connect to, can be one of "foundation", "kovan" or "ropsten". (default: "${DEFAULT_CHAIN}")`,
    DEFAULT_CHAIN
  )
  .option(
    '--no-run-parity',
    `${productName} will not attempt to run the locally installed parity.`
  )
  .option(
    '--ws-port <port>',
    `Specify the port portion of the WebSockets server ${productName} will connect to. (default: ${DEFAULT_WS_PORT})`,
    DEFAULT_WS_PORT
  )

  .parse(
    process.argv
      // We want to ignore some flags and not pass them down to Parity:
      // --inspect: `electron-webpack dev` runs Electron with the `--inspect` flag for HMR
      // -psn_*: https://github.com/paritytech/fether/issues/188
      // --ws-interface: we don't pass down this flag, because fether only allows 127.0.0.1 as WS interface
      .filter(
        arg =>
          !arg.startsWith('--inspect') &&
          !arg.startsWith('-psn_') &&
          !arg.startsWith('--ws-interface')
      )
  );

export default cli;
