// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const flatten = require('lodash/flatten');
const fs = require('fs');
const { spawn } = require('child_process');
const util = require('util');

const cli = require('../cli');
const handleError = require('./handleError');
const parityPath = require('../utils/parityPath');

const fsExists = util.promisify(fs.stat);
const fsReadFile = util.promisify(fs.readFile);
const fsUnlink = util.promisify(fs.unlink);

let parity = null; // Will hold the running parity instance

module.exports = {
  runParity(mainWindow) {
    // Create a logStream to save logs
    const logFile = `${parityPath()}.log`;

    console.log(cli);

    fsExists(logFile)
      .then(() => fsUnlink(logFile))
      .catch(() => {})
      .then(() => {
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        const parityArgv = [];

        // Run an instance of parity if we receive the `run-parity` message
        parity = spawn(
          parityPath(),
          flatten(
            Object.keys(parityArgv).map(key => [`--${key}`, parityArgv[key]]) // Transform {arg: value} into [--arg, value]
          )
            .concat('--light')
            .filter(value => value !== true) // --arg true is equivalent to --arg
        );

        parity.stdout.pipe(logStream);
        parity.stderr.pipe(logStream);
        parity.on('error', err => {
          handleError(err, 'An error occured while running parity.');
        });
        parity.on('close', (exitCode, signal) => {
          if (exitCode === 0) {
            return;
          }

          // If the exit code is not 0, then we show some error message
          if (Object.keys(parityArgv).length) {
            // If parity has been launched with some args, then most likely the
            // args are wrong, so we show the output of parity.
            return fsReadFile(logFile).then(data =>
              console.log(data.toString())
            );
          } else {
            handleError(
              new Error(`Exit code ${exitCode}, with signal ${signal}.`),
              'An error occured while running parity.'
            );
          }
        });
      })
      .then(() => {
        // Notify the renderers
        mainWindow.webContents.send('parity-running', true);
        global.isParityRunning = true; // Send this variable to renderes via IPC
      })
      .catch(err => {
        handleError(err, 'An error occured while running parity.');
      });
  },
  killParity() {
    if (parity) {
      console.log('Stopping parity.');
      parity.kill();
      parity = null;
    }
  }
};
