// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import cli from 'commander';

const { productName } = require('../../../electron-builder.json');
const { version } = require('../../../package.json');

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
    'The network to connect to, can be one of "foundation", "kovan" or "ropsten". (default: "kovan")',
    'kovan'
  )
  .option(
    '--no-run-parity',
    `${productName} will not attempt to run the locally installed parity.`
  )
  .option(
    '--ws-interface <ip>',
    `Specify the hostname portion of the WebSockets server ${productName} will connect to. IP should be an interface's IP address. (default: 127.0.0.1)`,
    '127.0.0.1'
  )
  .option(
    '--ws-port <port>',
    `Specify the port portion of the WebSockets server ${productName} will connect to. (default: 8546)`,
    8546
  )
  .parse(process.argv);

export default cli;
