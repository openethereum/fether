// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const cli = require('commander');
const fs = require('fs');
const omit = require('lodash/omit');
const { spawn } = require('child_process');

const parityPath = require('../utils/parityPath');
const { version } = require('../../package.json');

cli
  .version(version)
  .allowUnknownOption()
  .option(
    '--ui-dev',
    'The Light Wallet will load http://localhost:3000. WARNING: Only use this is you plan on developing on Parity UI.'
  )
  .parse(process.argv);

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @see https://github.com/tj/commander.js/blob/dcddf698c5463795401ad3d6382f5ec5ec060478/index.js#L1160-L1172
 */
const camelcase = flag =>
  flag
    .split('-')
    .reduce((str, word) => str + word[0].toUpperCase() + word.slice(1));

// Now we must think which arguments passed to cli must be passed down to
// parity.
const parityArgv = cli.rawArgs
  .splice(cli.rawArgs.findIndex(item => item.startsWith('--'))) // Remove all arguments until one --option
  .filter((item, index, array) => {
    const key = camelcase(item.substring(2)); // Remove first 2 '--' and then camelCase

    if (key in cli) {
      // If the option is consumed by commander.js, then we skip it
      return false;
    }

    // If it's not consumed by commander.js, and starts with '--', then we keep
    // it. This step is optional, used for optimization only.
    if (item.startsWith('--')) {
      return true;
    }

    const previousKey = camelcase(array[index - 1].substring(2));
    if (cli[previousKey] === item) {
      // If it's an argument of an option consumed by commander.js, then we
      // skip it too
      return false;
    }

    return true;
  });

module.exports = { cli, parityArgv };
