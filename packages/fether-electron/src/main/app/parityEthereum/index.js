// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { isParityRunning, runParity } from '@parity/electron';
import getRemainingArgs from 'commander-remaining-args';

import { TRUSTED_LOOPBACK, TRUSTED_WS_ORIGINS } from '../constants';
import { bundledParityPath } from '../utils/paths';
import handleError from '../utils/handleError';
import cli from '../cli';
import Pino from '../utils/pino';

const pino = Pino();

let hasCalledInitParityEthereum = false;

class ParityEthereum {
  constructor (fetherAppWindow) {
    if (hasCalledInitParityEthereum) {
      throw new Error('Unable to initialise Parity Ethereum more than once');
    }

    /*
     * - If an instance of Parity Ethereum is already running, we connect to it
     *   and then check in fether-react if the parity_versionInfo RPC returns
     *   a compatible version; otherwise, we error out.
     * - If no instance of Parity Ethereum is running, we run the bundled Parity
     *   Ethereum binary.
     *
     * `parity signer new-token` is run on the bundled binary in any case. We
     * don't use the $PATH anymore.
     */

    // Run the bundled Parity Ethereum if needed and wanted
    return new Promise(async (resolve, reject) => {
      // Parity Ethereum is already running: don't run the bundled binary
      if (await this.isRunning()) {
        resolve(true);
        return;
      }

      // User ran Fether with --no-run-parity: don't run the bundled binary
      if (!cli.runParity) {
        resolve(false);
        return;
      }

      // Parity Ethereum isn't running: run the bundled binary
      await this.run();
      pino.info('Running Parity Ethereum');
      resolve(true);
    })
      .then(isRunning => {
        // Notify the renderers
        fetherAppWindow.webContents.send('parity-running', isRunning);
        global.isParityRunning = isRunning; // Send this variable to renderers via IPC
      })
      .catch(handleError);
  }

  isRunning = async () => {
    return isParityRunning({
      wsInterface: TRUSTED_LOOPBACK,
      wsPort: cli.wsPort
    });
  };

  // Run the bundled Parity Ethereum binary
  run = async () => {
    return runParity({
      parityPath: bundledParityPath,
      flags: [
        ...getRemainingArgs(cli),
        '--light',
        '--chain',
        cli.chain,
        '--ws-port',
        cli.wsPort,
        '--ws-origins',
        TRUSTED_WS_ORIGINS
      ],
      onParityError: err =>
        handleError(err, 'An error occured with Parity Ethereum.')
    });
  };
}

export default ParityEthereum;
