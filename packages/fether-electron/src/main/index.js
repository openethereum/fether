// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import parseUrl from 'parse-url';
import { killParity } from '@parity/electron';

import Pino from './app/utils/pino';
import FetherApp from './app';
import fetherAppOptions from './app/options';

const { app } = electron;
const pino = Pino();

let withTaskbar = process.env.TASKBAR !== 'false';

pino.info('Platform detected: ', process.platform);

// Disable gpu acceleration on linux
// https://github.com/parity-js/fether/issues/85
if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration();
}

const options = fetherAppOptions(withTaskbar, {});

app.once('ready', () => {
  return new FetherApp(app, options);
});

// Event triggered by clicking the Electron icon in the menu Dock
// Reference: https://electronjs.org/docs/api/app#event-activate-macos
app.on('activate', (event, hasVisibleWindows) => {
  if (withTaskbar) {
    pino.info(
      'Detected Fether taskbar mode. Launching from application dock is not permitted.'
    );
    return;
  }

  if (hasVisibleWindows) {
    pino.info('Existing Fether window detected.');
    return;
  }

  return new FetherApp(app, options);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    killParity();
    app.quit();
  }
});

// Make sure Parity Ethereum stops when UI stops
app.on('before-quit', killParity);

app.on('will-quit', killParity);

app.on('quit', () => {
  pino.info('Leaving Fether');
  killParity();
});

/**
 * Security. Intercept new-window events (i.e. `window.open`) by
 * overriding event.newGuest without using the supplied options tag
 * to try to mitigate risk of an exploit re-enabling node integration
 * despite being turned off in the configuration
 * (i.e. `nodeIntegration: false`).
 *
 * References:
 * - https://www.electronjs.org/blog/webview-fix
 * - https://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html
 */
app.on('web-contents-created', (event, win) => {
  win.on(
    'new-window',
    (event, newURL, frameName, disposition, options, additionalFeatures) => {
      event.newGuest = null;

      if (!options.webPreferences) {
        options.webPreferences = {};
      }

      options.webPreferences.nodeIntegration = false;
      options.webPreferences.nodeIntegrationInWorker = false;
      options.webPreferences.webviewTag = false;
      delete options.webPreferences.preload;
    }
  );
});

/**
 * Security. Intercept and prevent new WebView (that may be used
 * by an attacker to gain access to the file system) in addition
 * to setting `webviewTag: false`
 *
 * Reference: https://www.electronjs.org/blog/webview-fix
 */
app.on('web-contents-created', (eventOuter, contents) => {
  contents.on('will-attach-webview', (eventInner, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    if (!params.src.startsWith('http://localhost.3000/')) {
      eventOuter.preventDefault();
      eventInner.preventDefault();
    }
  });

  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = parseUrl(navigationUrl);

    if (parsedUrl.origin !== 'http://localhost:3000') {
      event.preventDefault();
    }
  });
});
