// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

let cli = {};

/**
 * Set custom cli options.
 *
 * @param {*} cliOptions
 */
export const setCli = cliObject => {
  cli = cliObject;
};

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
export const parityArgv = () =>
  cli.rawArgs
    .splice(2) // Remove first 2 arguments which are program path
    .filter((item, index, array) => {
      const key = camelcase(item.replace('--', '').replace('no-', '')); // Remove '--' and then camelCase

      if (key in cli) {
        // If the option is consumed by commander.js, then we don't pass down to parity
        return false;
      }

      // If it's not consumed by commander.js, and starts with '--', then we keep
      // it.
      if (item.startsWith('--')) {
        return true;
      }

      // If it's the 1st argument and did not start with --, then we skip it
      if (index === 0) {
        return false;
      }

      const previousKey = camelcase(
        array[index - 1].replace('--', '').replace('no-', '')
      );
      if (cli[previousKey] === item) {
        // If it's an argument of an option consumed by commander.js, then we
        // skip it too
        return false;
      }

      return true;
    });

export { cli };
