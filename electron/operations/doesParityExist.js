// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const commandExists = require('command-exists');
const fs = require('fs');
const util = require('util');

const promiseAny = require('../utils/promiseAny');

const fsExists = util.promisify(fs.stat);

// Locations to test if parity binary exists
const locations = {
  linux: ['/bin/parity', '/usr/bin/parity', '/usr/local/bin/parity'],
  darwin: ['/Applications/Parity Ethereum.app/Contents/MacOS/parity'],
  win32: ['C:\\Program Files\\Parity Technologies\\Parity\\parity.exe']
};

/**
 * The default path to install parity, in case there's no other instance found
 * on the machine.
 */
const defaultParityPath = () =>
  `${app.getPath('userData')}/parity${process.platform === 'win32'
    ? '.exe'
    : ''}`;

/**
 * This function checks if parity has been installed on the local machine:
 * - first check if the program is in $PATH, using `command-exists`
 * - then check the OS default installation dir if a parity folder exists
 * - finally check parity-ui's own userData folder
 * This function should run in node env.
 * Returns a string which is the command to run parity.
 */
const doesParityExist = () =>
  commandExists('parity') // First test if `parity` command exists
    .then(() => 'parity') // If yes, return `parity` as command to launch parity
    .catch(() =>
      // Then test if OS-specific locations contain parity
      promiseAny(
        locations[process.platform].map(location =>
          fsExists(location).then(() => location)
        )
      )
    )
    .catch(() => fsExists(defaultParityPath())) // Finally test userData folder
    .catch(() => null); // Return null if no parity is found

module.exports = { defaultParityPath, doesParityExist };
