// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { checkClockSync } from '@parity/electron';
import settings from 'electron-settings';

import Pino from '../utils/pino';
import setupParityEthereum from '../methods/setupParityEthereum';
import ipcChannel from '../ipcChannel';

const pino = Pino();

var rpcResponsesSetUp = false;

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
      case 'RESTART_NODE_REQUEST': {
        setupParityEthereum();

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
      case 'RPC_REQUEST': {
        if (!rpcResponsesSetUp) {
          ipcChannel.on('message', data => {
            event.sender.send('send-to-renderer', {
              action: 'RPC_RESPONSE',
              from: 'fether:electron',
              payload: data
            });
          });

          rpcResponsesSetUp = true;
        }

        ipcChannel.send(data.payload);

        break;
      }
      default:
    }
  } catch (err) {
    pino.error(err);
  }
};
