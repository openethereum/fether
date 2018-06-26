// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app } from 'electron';
import fs from 'fs';
import { spawn } from 'child_process';
import { promisify } from 'util';

import { cli, parityArgv } from '../cli';
import isParityRunning from './isParityRunning';
import handleError from './handleError';
import { getParityPath } from './doesParityExist';
import Pino from '../utils/pino';

const fsChmod = promisify(fs.chmod);
const pino = Pino();
const pinoParity = Pino({ name: 'parity' });

let parity = null; // Will hold the running parity instance

// These are errors output by parity, which Parity UI ignores (i.e. doesn't
// panic). They happen when an instance of parity is already running, and
// parity-ui tries to launch another one.
const catchableErrors = [
  'is already in use, make sure that another instance of an Ethereum client is not running',
  'IO error: While lock file:'
];

export const runParity = async mainWindow => {
  try {
    // Do not run parity with --no-run-parity
    if (cli.runParity === false) {
      return;
    }

    // Do not run parity if there is already another instance running
    const isRunning = await isParityRunning(mainWindow);
    if (isRunning) {
      return;
    }

    // Do not run parity if parityPath has not been calculated. Shouldn't
    // happen as we always run runParity after doesParityExist resolves.
    if (!getParityPath()) {
      throw new Error('Attempting to run Parity before parityPath is set.');
    }

    // Some users somehow had no +x on the parity binary after downloading
    // it. We try to set it here (no guarantee it will work, we might not
    // have rights to do it).
    try {
      await fsChmod(getParityPath(), '755');
    } catch (e) {}

    let logLastLine; // Always contains last line of the Parity logs

    // Run an instance of parity with the correct args
    const args = [...parityArgv, '--light'];
    parity = spawn(getParityPath(), args);
    pino.info(
      `Running command "${getParityPath().replace(' ', '\\ ')} ${args.join(
        ' '
      )}".`
    );

    // Save in memory the last line of the log file, for handling error
    const callback = data => {
      if (data && data.length) {
        logLastLine = data.toString();
      }
      pinoParity.info(data.toString());
    };
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
        logLastLine &&
        catchableErrors.some(error => logLastLine.includes(error))
      ) {
        pino.warn(
          'Another instance of parity is running, closing local instance.'
        );
        return;
      }

      // If the exit code is not 0, then we show some error message
      if (Object.keys(parityArgv).length > 0) {
        app.exit(1);
      } else {
        handleError(
          new Error(`Exit code ${exitCode}, with signal ${signal}.`),
          'An error occured while running parity.'
        );
      }
    });

    // Notify the renderers
    mainWindow.webContents.send('parity-running', true);
    global.isParityRunning = true; // Send this variable to renderes via IPC

    return Promise.resolve();
  } catch (err) {
    handleError(err, 'An error occured while running parity.');
  }
};

export const killParity = () => {
  if (parity) {
    pino.info('Stopping parity.');
    parity.kill();
    parity = null;
  }
};
