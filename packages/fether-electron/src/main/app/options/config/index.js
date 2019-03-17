// Copyright 2015-2019 Parity Technologies (UK) Ltd.
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
let iconPath = path.join(staticPath, 'assets', 'icons', 'mac', 'iconDock.png');
let iconDockPath = '';

if (process.platform === 'win32') {
  iconPath = path.join(staticPath, 'assets', 'icons', 'win', 'icon.ico');
} else if (process.platform === 'darwin') {
  // https://github.com/electron/electron/blob/master/docs/api/native-image.md#template-image
  iconPath = path.join(
    staticPath,
    'assets',
    'icons',
    'mac',
    'iconTemplate.png'
  );
  iconDockPath = path.join(
    staticPath,
    'assets',
    'icons',
    'mac',
    'iconDock.png'
  );
}

const windowPosition =
  process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter';

let tooltip =
  'Click to toggle Fether window. Right-click Fether window to toggle Fether menu';

// API docs: https://electronjs.org/docs/api/browser-window
const DEFAULT_OPTIONS = {
  alwaysOnTop: false,
  dir: staticPath,
  frame: true,
  height: 640,
  hasShadow: true,
  icon: iconPath,
  iconDock: iconDockPath,
  index: INDEX_HTML_PATH,
  resizable: false,
  show: false, // Run showWindow later
  showDockIcon: true, // macOS usage only
  tabbingIdentifier: 'parity',
  width: 360,
  windowPosition: windowPosition, // Required
  withTaskbar: false
};

const TASKBAR_OPTIONS = {
  frame: false,
  height: 515,
  // On Linux the user must click the tray icon and then click the tooltip
  // to toggle the Fether window open/close
  tooltip: tooltip,
  width: 352,
  withTaskbar: true
};

const SECURITY_OPTIONS = {
  webPreferences: {
    /**
     * Potential security risk options set explicitly even when default is favourable.
     * Reference: https://electronjs.org/docs/tutorial/security
     */
    devTools: true,
    /**
     * `nodeIntegration` when enabled allows the software to use Electron's APIs
     * and gain access to Node.js. It must be disabled to restricting access to
     * Node.js global symbols like `require` from global scope and requires the
     * user to sanitise user inputs to reduce the possible XSS attack surface.
     */
    nodeIntegration: false, // Must be disabled
    nodeIntegrationInWorker: false, // Must be disabled
    /**
     * Electron security recommends us to set this to `true`. However, we need
     * some communication between the main process and the renderer process
     * (via ipcMain and ipcRenderer), so we need to disabled contextIsolation.
     * https://stackoverflow.com/questions/55164360/with-contextisolation-true-is-it-possible-to-use-ipcrenderer
     * Currently experimental and may change or be removed in future Electron releases.
     */
    contextIsolation: false, // Should be enabled
    /**
     * Isolate access to Electron/Node.js from the Fether web app, by creating
     * a bridge which plays the role of an API between main and renderer
     * processes.
     * https://github.com/electron/electron/issues/9920#issuecomment-336757899
     */
    preload: path.join(staticPath, 'preload.js'),
    /**
     * Sandbox the BrowserWindow renderer associated with the window to mitigate
     * against the risk of malicious preload scripts, whilst still allowing access to
     * all underlying Electron/Node.js primitives using `remote` or internal IPC
     * Reference: https://doyensec.com/resources/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
     */
    sandbox: true, // Do not set to false. Run electron with `electron --enable-sandbox` to sandbox all BrowserWindow instances
    enableRemoteModule: true, // Remote is required in fether-react parityStore.js
    // Enables same origin policy to prevent execution of insecure code. Do not set to false
    webSecurity: true,
    allowRunningInsecureContent: false, // Do not set to true
    plugins: false,
    experimentalFeatures: false, // Do not set to true
    enableBlinkFeatures: '', // Do not enable any of them
    nativeWindowOpen: true,
    /**
     * `webviewTag` when enabled allows content to be embedded into the
     * Electron app and to be run as a separate process when Electron handles
     * new browser windows. It is important to reduce privileges
     * to try and prevent attackers from controlling the new browser windows
     * with the `window.open` command and passing a WebView tag
     * (see `webView`) to enable `nodeIntegration`.
     */
    webviewTag: false, // Associated with `will-attach-webview`
    safeDialogs: true,
    safeDialogsMessage: 'Electron consecutive dialog protection was triggered',
    navigateOnDragDrop: false
  }
};

export { DEFAULT_OPTIONS, SECURITY_OPTIONS, TASKBAR_OPTIONS };
