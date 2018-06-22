// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app } from 'electron';
import commandExists from 'command-exists';
import fs from 'fs';
import promiseAny from 'promise-any';
import { promisify } from 'util';

import Pino from '../utils/pino';

const fsExists = promisify(fs.stat);
const pino = Pino();

// The default path to install parity, in case there's no other instance found
// on the machine.
export const defaultParityPath = `${app.getPath('userData')}/parity${
  process.platform === 'win32' ? '.exe' : ''
}`;

let parityPath; // The real parity path, will be populated after doesParityExist Promise resolves

// OS locations to test if parity binary exists
const locations = {
  linux: ['/bin/parity', '/usr/bin/parity', '/usr/local/bin/parity'],
  darwin: ['/Applications/Parity Ethereum.app/Contents/MacOS/parity'],
  win32: ['C:\\Program Files\\Parity Technologies\\Parity\\parity.exe']
};

/**
 * This function checks if parity has been installed on the local machine:
 * - first check if the program is in $PATH, using `command-exists`
 * - then check the OS default installation dir if a parity folder exists
 * - finally check parity-ui's own userData folder
 * This function should run in node env.
 *
 * @return Promise<String> - Resolves to a string which is the command to run parity.
 */
export const doesParityExist = () => {
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
    })
    .catch(err => {
      pino.info(`Parity not found on machine.`);
      throw err;
    });
};

export const getParityPath = () => {
  return parityPath;
};
