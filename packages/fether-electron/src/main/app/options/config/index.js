// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';
import url from 'url';

import staticPath from '../../utils/staticPath';

// https://electronjs.org/docs/tutorial/security#electron-security-warnings
process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = true;

const INDEX_HTML_PATH =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(staticPath, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

// Icon path differs when started with `yarn electron` or `yarn start`
const ICON_PATH =
  process.env.ELECTRON_START_ICON || process.env.SKIP_PREFLIGHT_CHECK
    ? 'src/main/app/options/config/icons/parity-ethereum-fether-icon.png'
    : path.join(__dirname, 'icons', 'parity-ethereum-fether-icon.png');

const shouldUseDevTools = process.env.NODE_ENV !== 'production';

// API docs: https://electronjs.org/docs/api/browser-window
const DEFAULT_OPTIONS = {
  alwaysOnTop: true,
  frame: true,
  height: 640,
  index: INDEX_HTML_PATH,
  resizable: false,
  show: true,
  tabbingIdentifier: 'parity',
  width: 360,
  withTaskbar: false
};

const windowPosition =
  process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter';

const TASKBAR_OPTIONS = {
  dir: staticPath,
  frame: false,
  hasShadow: true,
  height: 464,
  icon: ICON_PATH,
  show: false, // Run showWindow later when taskbar has loaded in FetherApp
  showDockIcon: true,
  tooltip: 'Parity Fether',
  windowPosition: windowPosition, // Required
  width: 352,
  withTaskbar: true
};

const SECURITY_OPTIONS = {
  webPreferences: {
    /**
     * Potential security risk options set explicitly even when default is favourable.
     * Reference: https://electronjs.org/docs/tutorial/security
     */
    devTools: shouldUseDevTools,
    /**
     * `nodeIntegration` when enabled allows the software to use Electron's APIs
     * and gain access to Node.js and requires the user to sanitise user inputs
     * to reduce the possible XSS attack surface.
     */
    // nodeIntegration: true, // FIXME - should be disabled but causes error
    nodeIntegrationInWorker: false,
    sandbox: false,
    enableRemoteModule: false,
    webSecurity: true,
    allowRunningInsecureContent: false,
    plugins: false,
    experimentalFeatures: false,
    // contextIsolation: true, // FIXME - should be enabled but causes error
    nativeWindowOpen: true,
    /**
     * `webviewTag` when enabled allows content to be embedded into the
     * Electron app and to be run as a separate process when Electron handles
     * new browser windows. It is important to reduce privileges
     * to try and prevent attackers from controlling the new browser windows
     * with the `window.open` command and passing a WebView tag
     * (see `webView`) to enable `nodeIntegration`.
     */
    webviewTag: false,
    safeDialogs: true,
    safeDialogsMessage: 'Electron consecutive dialog protection was triggered',
    navigateOnDragDrop: false
  }
};

export { DEFAULT_OPTIONS, SECURITY_OPTIONS, TASKBAR_OPTIONS };
