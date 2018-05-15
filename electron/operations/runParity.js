// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const fs = require('fs');
const noop = require('lodash/noop');
const { spawn } = require('child_process');
const util = require('util');

const { parityArgv } = require('../cli');
const handleError = require('./handleError');
const parityPath = require('../utils/parityPath');

const fsExists = util.promisify(fs.stat);
const fsUnlink = util.promisify(fs.unlink);

let parity = null; // Will hold the running parity instance

module.exports = {
  runParity (mainWindow) {
    // Create a logStream to save logs
    const logFile = `${parityPath()}.log`;

    fsExists(logFile)
      .then(() => fsUnlink(logFile)) // Delete logFile and create a fresh one on each launch
      .catch(noop)
      .then(() => {
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        let logLastLine; // Always contains last line of the logFile

        // Run an instance of parity with the correct args
        parity = spawn(parityPath(), parityArgv.concat('--light'));

        // Pipe all parity command output into the logFile
        parity.stdout.pipe(logStream);
        parity.stderr.pipe(logStream);
        // Save in memory the last line of the log file, for handling error
        const callback = data => (logLastLine = data.toString());
        parity.stdout.on('data', callback);
        parity.stderr.on('data', callback);

        parity.on('error', err => {
          handleError(err, 'An error occured while running parity.');
        });
        parity.on('close', (exitCode, signal) => {
          if (exitCode === 0) {
            return;
          }

          // When there's already an instance of parity running, then the log
          // is logging a particular line, see below. In this case, we just
          // silently ignore our local instance, and let the 1st parity
          // instance be the main one.
          if (
            logLastLine.includes(
              'is already in use, make sure that another instance of an Ethereum client is not running or change the address using the --ws-port and --ws-interface options.'
            )
          ) {
            console.log(
              'Another instance of parity is running, closing local instance.'
            );
            return;
          }

          // If the exit code is not 0, then we show some error message
          if (Object.keys(parityArgv).length > 1) {
            // If parity has been launched with some args, then most likely the
            // args are wrong, so we show the output of parity.
            const log = fs.readFileSync(logFile);
            console.log(log.toString());
            app.exit(1);
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
  killParity () {
    if (parity) {
      console.log('Stopping parity.');
      parity.kill();
      parity = null;
    }
  }
};
