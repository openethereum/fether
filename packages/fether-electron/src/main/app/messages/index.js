// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { checkClockSync, signerNewToken } from '@parity/electron';

import Pino from '../utils/pino';

const pino = Pino();

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (fetherAppWindow, event, action, ...args) => {
  try {
    if (!action) {
      return;
    }
    switch (action) {
      case 'app-resize': {
        if (!fetherAppWindow || !args[0]) {
          return;
        }
        const [width] = fetherAppWindow.getContentSize();
        // Conversion to integer is required to pass as argument to setContentSize.
        // Reference: https://electronjs.org/docs/all#winsetcontentsizewidth-height-animate
        const newHeight = parseInt(args[0]);
        const feedbackButtonHeight = 20;
        const resizeHeight = newHeight + 2;
        const height =
          process.platform === 'win32' && fetherAppWindow.isMenuBarVisible()
            ? resizeHeight + feedbackButtonHeight
            : resizeHeight;

        fetherAppWindow.setContentSize(width, height);
        break;
      }
      case 'check-clock-sync': {
        checkClockSync().then(t => {
          event.sender.send('check-clock-sync-reply', t);
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
