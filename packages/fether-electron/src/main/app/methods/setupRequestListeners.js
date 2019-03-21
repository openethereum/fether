// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import messages from '../messages';
import { TRUSTED_URLS } from '../constants';
import Pino from '../utils/pino';

const pino = Pino();
const { ipcMain, session } = electron;

pino.debug(
  'Configuring Content-Security-Policy for environment: ',
  process.env.NODE_ENV
);
// Note: `worker-src blob:` required for the webcam
const CSP =
  process.env.NODE_ENV === 'development'
    ? `
    default-src 'self';
    script-src 'self' file: http: blob: 'unsafe-inline' 'unsafe-eval';
    connect-src 'self' file: http: https: ws: wss:;
    img-src 'self' 'unsafe-inline' file: data: blob: http: https:;
    style-src 'self' 'unsafe-inline' file: blob:;
    worker-src blob:;
  `
    : `
    default-src 'none';
    script-src file: 'unsafe-inline';
    connect-src http: https: ws: wss:;
    img-src 'self' 'unsafe-inline' file: data: blob: http: https:;
    style-src 'unsafe-inline' file: blob:;
    worker-src blob:;
  `;

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
    /* eslint-disable */
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [CSP]
      }
    });
    /* eslint-enable */
  });

  /**
   * Limit specific permissions (i.e. `openExternal`) in response to events from particular origins
   * to limit the exploitability of applications that load remote content.
   *
   * References:
   * https://electronjs.org/docs/api/session#sessetpermissionrequesthandlerhandler
   * https://doyensec.com/resources/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
   */
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback, details) => {
      pino.debug(
        'Processing request to open external link to url in setPermissionRequestHandler: ',
        details.externalURL
      );

      let permissionGranted = false;

      // FIXME - does not work
      if (
        webContents.getURL() !== 'https://127.0.0.1:3000/' &&
        permission === 'openExternal'
      ) {
        if (!TRUSTED_URLS.includes(details.externalURL)) {
          pino.info(
            'Unable to open external link to untrusted content url due to setPermissionRequestHandler: ',
            details.externalURL
          );
        } else {
          permissionGranted = true;
        }

        return callback(permissionGranted);
      } else {
        permissionGranted = true;

        return callback(permissionGranted);
      }
    }
  );
}

export default setupRequestListeners;
