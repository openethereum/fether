// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/**
 * Preload script is run before Electron loads the guest page into
 * the renderer and it still has access to Electron and Node.js APIs
 * so we can use it to define a gated API in an isolated context that
 * only exposes the bare minimum functionality that the Fether web app
 * requires (instead of unrestricted access to Node.js file system and
 * network stack).
 *
 * Isolating context is achieved by setting `contextIsolation: true` and
 * and `sandbox: true` to mitigate against the risk of malicious preload scripts
 *
 * Restricting access to Node.js global symbols like `require` from global scope
 * by setting `nodeIntegration: false`
 *
 * It should not be possible to run the following in the Fether web app
 * Developer Tools Console for example:
 *
 * ```
 * var exec = require('child_process').exec;
 * exec('ls -al', function(error, stdout, stderr) {
 *   console.log('stdout: ' + stdout);
 *   console.log('stderr: ' + stderr);
 *   if (error !== null) {
 *     console.log('exec error: ' + error);
 *   }
 * });
 * ```
 *
 * Reference: https://slack.engineering/interops-labyrinth-sharing-code-between-web-electron-apps-f9474d62eccc
 */

const { ipcRenderer, remote } = require('electron');

// FIXME - the following does not work, as we are unable to share this `window`
// from fether-electron with `window` in fether-react parityStore. The idea would be to
// move all usage of `remote` and `ipcRenderer` from fether-react into fether-electron where
// it is isolated and somehow communicate only what we want to expose.
// TODO - investigate how it was done in https://github.com/parity-js/shell/blob/master/src/preload.js
function init () {
  console.log('Initialising Electron Preload Script');

  // Expose only a bridging API to the Fether web app.
  // Set methods on global `window`. Additional methods added later by web app
  //
  // Do not expose functionality or APIs that could compromise the computer
  // such as core Electron (i.e. `electron`, `remote`), IPC (`ipcRenderer`) or Node.js modules
  window.bridge = {
    // Example only
    wsInterface: remote.getGlobal('wsInterface'),
    wsPort: remote.getGlobal('wsInterface')
  };
}

init();
