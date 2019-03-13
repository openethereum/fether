// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { checkClockSync, signerNewToken } from '@parity/electron';

import Pino from '../utils/pino';
import { bundledParityPath } from '../utils/paths';

const pino = Pino();

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (fetherApp, event, action, ...args) => {
  try {
    if (!action) {
      return;
    }
    switch (action) {
      case 'app-right-click': {
        if (!fetherApp.win) {
          return;
        }
        fetherApp.contextWindowMenu.getMenu().popup({ window: fetherApp.win });
        break;
      }
      case 'check-clock-sync': {
        checkClockSync().then(t => {
          event.sender.send('check-clock-sync-reply', t);
        });
        break;
      }
      case 'signer-new-token': {
        const token = await signerNewToken({ parityPath: bundledParityPath });
        // Send back the token to the renderer process
        event.sender.send('signer-new-token-reply', token);
        break;
      }
      default:
    }
  } catch (err) {
    pino.error(err);
  }
};
