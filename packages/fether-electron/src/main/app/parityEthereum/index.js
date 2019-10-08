// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { runParity } from '@parity/electron';

import { bundledParityPath, BUNDLED_IPC_PATH } from '../utils/paths';
import handleError from '../utils/handleError';
import cli from '../cli';
import ipcChannel from '../ipcChannel';
import Pino from '../utils/pino';

const pino = Pino();

class ParityEthereum {
  constructor () {
    if (cli.ipcPath) {
      pino.info('--ipc-path provided; connecting to', cli.ipcPath);

      return ipcChannel.init(cli.ipcPath).catch(handleError);
    }

    pino.info('Running Parity Ethereum');

    // Run the bundled Parity Ethereum
    return this.run()
      .then(
        _ =>
          new Promise((resolve, reject) => {
            setTimeout(resolve, 1000); // delay is needed to give time for the ipc file to be set up
          })
      )
      .then(() => ipcChannel.init(BUNDLED_IPC_PATH))
      .catch(handleError);
  }

  // Run the bundled Parity Ethereum binary
  run = async () => {
    return runParity({
      parityPath: bundledParityPath,
      flags: [
        '--light',
        '--no-jsonrpc',
        '--no-ws',
        '--ipc-path',
        BUNDLED_IPC_PATH,
        '--ipc-apis',
        'all', // we need to enable personal to use personal_signTransaction
        '--chain',
        cli.chain
      ],
      onParityError: err =>
        handleError(err, 'An error occured with Parity Ethereum.')
    });
  };
}

export default ParityEthereum;
