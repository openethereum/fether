// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { spawn } from 'child_process';

import { getParityPath } from './doesParityExist';
import logCommand from '../utils/logCommand';
import Pino from '../utils/pino';

const pino = Pino();

export default event => {
  pino.info('Requesting new token.');

  // Generate a new token
  const paritySigner = spawn(getParityPath(), ['signer', 'new-token']);

  pino.info(logCommand(getParityPath(), ['signer', 'new-token']));

  // Listen to the output of the previous command
  paritySigner.stdout.on('data', data => {
    // If the output line is xxxx-xxxx-xxxx-xxxx, then it's our token
    const match = data
      .toString()
      .match(
        /[a-zA-Z0-9]{4}(-)?[a-zA-Z0-9]{4}(-)?[a-zA-Z0-9]{4}(-)?[a-zA-Z0-9]{4}/
      );

    if (match) {
      const token = match[0];

      // Send back the token to the renderer process
      event.sender.send('asynchronous-reply', token);
      paritySigner.kill(); // We don't need the signer anymore
    }
  });
};
