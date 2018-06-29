// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import axios from 'axios';
import retry from 'async-retry';

import { cli } from './utils/cli';
import logger from './utils/logger';

// Try to ping these hosts
const hostsToPing = ['http://127.0.0.1:8545', 'http://127.0.0.1:8546'];
if (cli.wsInterface || cli.wsPort) {
  // Also try custom host/port if a --ws-interface or --ws-port flag is passed
  hostsToPing.push(
    `http://${cli.wsInterface || '127.0.0.1'}:${cli.wsPort || '8545'}`
  );
}

/**
 * Detect if another instance of parity is already running or not. To achieve
 * that, we just ping on the common hosts, see hostsToPing array.
 *
 * @return [Promise<Boolean>] - Promise that resolves to true or false.
 */
export const isParityRunning = async () => {
  try {
    // Retry to ping as many times as there are hosts in `hostsToPing`
    await retry(
      async (_, attempt) => {
        const host = hostsToPing[attempt - 1]; // Attempt starts with 1
        await axios.get(host);
        logger()('@parity/electron:main')(
          `Another instance of parity is already running on ${host}, skip running local instance.`
        );
      },
      { retries: hostsToPing.length }
    );

    return true;
  } catch (e) {
    return false;
  }
};
