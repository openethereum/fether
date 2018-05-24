// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const commandExists = require('command-exists');
const fs = require('fs');
const promiseAny = require('promise-any');
const { promisify } = require('util');

const pino = require('../utils/pino')({ name: 'electron' });

const fsExists = promisify(fs.stat);

// The default path to install parity, in case there's no other instance found
// on the machine.
const defaultParityPath = `${app.getPath(
  'userData'
)}/parity${process.platform === 'win32' ? '.exe' : ''}`;

let parityPath; // The real parity path, will be populated after doesParityExist Promise resolves

// OS locations to test if parity binary exists
const locations = {
  linux: ['/bin/parity', '/usr/bin/parity', '/usr/local/bin/parity'],
  darwin: ['/Applications/Parity Ethereum.app/Contents/MacOS/parity'],
  win32: ['C:\\Program Files\\Parity Technologies\\Parity\\parity.exe']
};

module.exports = {
  defaultParityPath,
  /**
   * This function checks if parity has been installed on the local machine:
   * - first check if the program is in $PATH, using `command-exists`
   * - then check the OS default installation dir if a parity folder exists
   * - finally check parity-ui's own userData folder
   * This function should run in node env.
   *
   * @return Promise<String> - Resolves to a string which is the command to run parity.
   */
  doesParityExist () {
    return commandExists('parity') // First test if `parity` command exists
      .then(() => 'parity') // If yes, return `parity` as command to launch parity
      .catch(() =>
        // Then test if OS-specific locations contain parity
        promiseAny(
          locations[process.platform].map(location =>
            fsExists(location).then(() => location)
          )
        )
      )
      .catch(() =>
        // Finally test userData folder
        fsExists(defaultParityPath).then(() => defaultParityPath)
      )
      .then(path => {
        parityPath = path; // Save the final result in module variable
        pino.info(`Parity found on machine, can be run with "${path}".`);
        return path;
      });
  },
  parityPath () {
    return parityPath;
  }
};
