// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { spawn } from 'child_process';

import debug from './utils/debug';
import { getParityPath } from './getParityPath';
import logCommand from './utils/logCommand';

/**
 * Launch a parity instance to get a secure token.
 */
export const signerNewToken = () =>
  new Promise(async (resolve, reject) => {
    debug('main')('Requesting new token.');

    const parityPath = await getParityPath();

    // Generate a new token
    const paritySigner = spawn(parityPath, ['signer', 'new-token']);
    debug('main')(logCommand(parityPath, ['signer', 'new-token']));

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
        paritySigner.kill(); // We don't need the signer anymore
        debug('main')('Successfully extracted token.');
        resolve(token);
      }
    });

    // If after 2s we still didn't find the token, consider it failed.
    setTimeout(() => {
      reject(new Error('Error extracting token.'));
    }, 2000);
  });
