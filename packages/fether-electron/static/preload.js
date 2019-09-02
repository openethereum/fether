// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/**
 * Preload script is run before Electron loads the guest page into
 * the renderer so it still has access to Electron and Node.js APIs
 * allowing us to use it to define a gated API in an isolated context that
 * only exposes the bare minimum functionality that the Fether web app
 * requires (instead of unrestricted access to Node.js file system and
 * network stack).
 *
 * Reference: https://slack.engineering/interops-labyrinth-sharing-code-between-web-electron-apps-f9474d62eccc
 *
 * This preload script handles communication between main and renderer processes.
 * https://github.com/electron/electron/issues/13130
 */

const { ipcRenderer } = require('electron');

const RENDERER_ORIGIN =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'file://';

/**
 * Handler that receives an IPC message from the main process, and passes it
 * down to the renderer process.
 *
 * @param {*} _event The IPC event we receive from the main process.
 * @param {*} data The data of the IPC message.
 */
function receiveIpcMessage (_event, data) {
  window.postMessage(data, RENDERER_ORIGIN);
}

/**
 * Handler that receives a post message from the renderer process, and passes
 * it down to the main process.
 *
 * @param {*} _event The post message event we receive from the renderer process.
 */
function receivePostMessage (event) {
  const { data, origin } = event;

  if (origin !== RENDERER_ORIGIN) {
    return;
  }

  if (!data) {
    return;
  }

  const { from } = data;

  if (from === 'fether:electron') {
    // Since `payload` and `frontend` have the same origin, we use the `from`
    // field to differentiate who's sending the postMessage to whom. If the
    // message has been sent by `electron`, we ignore.
    return;
  }

  ipcRenderer.send('send-to-main', data);
}

ipcRenderer.on('send-to-renderer', receiveIpcMessage);
window.addEventListener('message', receivePostMessage);
