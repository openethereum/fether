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
 */

const { ipcRenderer, remote } = require('electron');

const IS_PROD = process.env.NODE_ENV === 'production';

function init () {
  console.log(
    `Initialising Electron Preload Script in environment: ${
      IS_PROD ? 'production' : 'development'
    }`
  );

  /**
   * Expose only a bridging API to the Fether web app.
   * Set methods on global `window`. Additional methods added later by web app
   *
   * Do not expose functionality or APIs that could compromise the computer
   * such as core Electron (i.e. `electron`, `remote`), IPC (`ipcRenderer`)
   * or Node.js modules like `require`.
   *
   * Note however that we require `ipcRenderer` to be exposed for communication
   * between the main process and the renderer process. Hence why
   * we have had no other choice but to set `contextIsolation: false`
   *
   * Example 1: Do not expose as `window.bridge.electron` or `window.bridge.remote`.
   * Example 2: `require` should not be defined in Chrome Developer Tools Console.
   */
  window.bridge = {
    defaultWsInterface: remote.getGlobal('defaultWsInterface'),
    defaultWsPort: remote.getGlobal('defaultWsPort'),
    ipcRenderer,
    isParityRunningStatus: remote.getGlobal('isParityRunning'),
    IS_PROD,
    wsPort: remote.getGlobal('wsPort')
  };
}

init();
