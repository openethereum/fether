// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { signerNewToken, checkTime } from '@parity/electron';

import Pino from '../utils/pino';

const pino = Pino();

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (mainWindow, event, action, ...args) => {
  try {
    if (!action) {
      return;
    }
    switch (action) {
      case 'app-resize': {
        const [width] = mainWindow.getContentSize();
        const newHeight = args[0];
        mainWindow.setContentSize(width, Math.round(newHeight) + 2);
        break;
      }
      case 'check-time': {
        checkTime().then(t => {
          event.sender.send('check-time-reply', t);
        });
        break;
      }
      case 'signer-new-token': {
        const token = await signerNewToken();
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
