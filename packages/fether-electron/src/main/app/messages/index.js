// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { checkClockSync, signerNewToken } from '@parity/electron';
import settings from 'electron-settings';

import { bundledParityPath } from '../utils/paths';
import cli from '../cli';
import Pino from '../utils/pino';
import { TRUSTED_LOOPBACK } from '../constants';

const pino = Pino();

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (fetherApp, event, data) => {
  try {
    pino.debug(
      `Received IPC message from ${data.from}, with data ${JSON.stringify(
        data
      )}`
    );
    if (!data) {
      return;
    }

    switch (data.action) {
      case 'APP_RIGHT_CLICK_REQUEST': {
        if (!fetherApp.win) {
          return;
        }
        fetherApp.contextWindowMenu.getMenu().popup({ window: fetherApp.win });
        break;
      }
      case 'CHECK_CLOCK_SYNC_REQUEST': {
        const payload = await checkClockSync();
        event.sender.send('send-to-renderer', {
          action: 'CHECK_CLOCK_SYNC_RESPONSE',
          from: 'fether:electron',
          payload
        });

        break;
      }
      case 'SET_LANGUAGE_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'SET_LANGUAGE_RESPONSE',
          from: 'fether:electron',
          payload: settings.get('fether-language')
        });
        break;
      }
      case 'SIGNER_NEW_TOKEN_REQUEST': {
        const token = await signerNewToken({ parityPath: bundledParityPath });
        // Send back the token to the renderer process
        event.sender.send('send-to-renderer', {
          action: 'SIGNER_NEW_TOKEN_RESPONSE',
          from: 'fether:electron',
          payload: token
        });
        break;
      }
      case 'WS_INTERFACE_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'WS_INTERFACE_RESPONSE',
          from: 'fether:electron',
          payload: TRUSTED_LOOPBACK
        });

        break;
      }
      case 'WS_PORT_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'WS_PORT_RESPONSE',
          from: 'fether:electron',
          payload: cli.wsPort
        });

        break;
      }
      default:
    }
  } catch (err) {
    pino.error(err);
  }
};
