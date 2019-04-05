// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { IS_PROD } from '../constants';
import { CSP } from '../utils/csp';
import messages from '../messages';
import Pino from '../utils/pino';

const pino = Pino();
const { ipcMain, session } = electron;

function setupRequestListeners (fetherApp) {
  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', (...args) => {
    return messages(fetherApp, ...args);
  });

  // WS calls have Origin `file://` by default, which is not trusted.
  // We override Origin header on all WS connections with an authorized one.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['ws://*/*', 'wss://*/*']
    },
    (details, callback) => {
      if (!fetherApp.win || !fetherApp.win.id) {
        // There might be a split second where the user closes the app, so
        // this.fether.window is null, but there is still a network request done.
        return;
      }
      details.requestHeaders.Origin = `parity://${fetherApp.win.id}.ui.parity`;
      callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
    }
  );

  // Content Security Policy (CSP)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    pino.debug(
      `Configuring Content-Security-Policy for environment ${
        IS_PROD ? 'production' : 'development'
      }`
    );

    /* eslint-disable */
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [CSP]
      }
    });
    /* eslint-enable */
  });
}

export default setupRequestListeners;
