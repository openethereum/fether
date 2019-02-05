// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import messages from '../messages';
const { ipcMain, session } = electron;

function setupRequestListeners (fetherApp) {
  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', (...args) => {
    return messages(fetherApp.window, ...args);
  });

  // WS calls have Origin `file://` by default, which is not trusted.
  // We override Origin header on all WS connections with an authorized one.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['ws://*/*', 'wss://*/*']
    },
    (details, callback) => {
      if (!fetherApp.window) {
        // There might be a split second where the user closes the app, so
        // this.fether.window is null, but there is still a network request done.
        return;
      }
      details.requestHeaders.Origin = `parity://${
        fetherApp.window.id
      }.ui.parity`;
      callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
    }
  );
}

export default setupRequestListeners;
