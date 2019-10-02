// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { runParity } from '@parity/electron';

import { bundledParityPath, IPC_PATH } from '../utils/paths';
import handleError from '../utils/handleError';
import cli from '../cli';
import ipcChannel from '../ipcChannel';
import Pino from '../utils/pino';

const pino = Pino();

class ParityEthereum {
  constructor () {
    pino.info('Running Parity Ethereum');

    // Run the bundled Parity Ethereum
    return this.run()
      .then(
        _ =>
          new Promise((resolve, reject) => {
            // delay is needed to give time for the ipc file to be set up
            setTimeout(() => {
              ipcChannel.init(IPC_PATH);
              resolve(true);
            }, 1000);
          })
      )
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
        IPC_PATH,
        '--chain',
        cli.chain
      ],
      onParityError: err =>
        handleError(err, 'An error occured with Parity Ethereum.')
    });
  };
}

export default ParityEthereum;
