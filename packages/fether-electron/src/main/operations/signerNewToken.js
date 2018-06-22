// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const pino = require('../utils/pino')();
const { spawn } = require('child_process');

const { parityPath } = require('./doesParityExist');

module.exports = event => {
  // Generate a new token
  const paritySigner = spawn(parityPath(), ['signer', 'new-token']);

  pino.info('Requesting new token.');

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
