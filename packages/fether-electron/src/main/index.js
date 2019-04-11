// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import { URL } from 'url';
import { killParity } from '@parity/electron';

import Pino from './app/utils/pino';
import isTrustedUrlPattern from './app/utils/isTrustedUrlPattern';
import FetherApp from './app';
import { SECURITY_OPTIONS } from './app/options/config';
import fetherAppOptions from './app/options';

const pino = Pino();
const { app, shell } = electron;
const { TRUSTED_URLS } = SECURITY_OPTIONS.fetherNetwork;

let withTaskbar = process.env.TASKBAR !== 'false';

pino.info('Platform detected: ', process.platform);
pino.info('Process type: ', process.type);
pino.info('Process ID: ', process.pid);
pino.info('Process args: ', process.argv);
pino.info('Electron version: ', process.versions['electron']);

// Disable gpu acceleration on linux
// https://github.com/parity-js/fether/issues/85
if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration();
}

let fetherApp;
const options = fetherAppOptions(withTaskbar, {});

const gotTheLock = app.requestSingleInstanceLock();
pino.info(
  `Single Fether instance lock obtained by ${
    app.hasSingleInstanceLock() ? 'this instance' : 'another instance'
  }`
);

if (!gotTheLock) {
  pino.info(
    'Multiple instances of Fether on the same device are not permitted'
  );
  app.quit();
}

app.once('ready', () => {
  fetherApp = new FetherApp(app, options);

  return fetherApp;
});

// Prevent a second instance of Fether. Focus the first window instance
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (fetherApp.win) {
    if (fetherApp.win.isMinimized()) {
      fetherApp.win.restore();
    }
    fetherApp.win.focus();
  }
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

  fetherApp = new FetherApp(app, options);

  return fetherApp;
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
  app.releaseSingleInstanceLock();
  killParity();
});

// Security
app.on('web-contents-created', (eventOuter, win) => {
  win.on('will-navigate', (event, url) => {
    // FIXME - check that parser is memory-safe
    //
    // Reference: https://letsencrypt.org/docs/certificates-for-localhost/

    const parsedUrl = new URL(url);

    pino.info(
      'Processing request to navigate to url in will-navigate listener: ',
      parsedUrl.href
    );

    if (
      !TRUSTED_URLS.includes(parsedUrl.href) &&
      !isTrustedUrlPattern(parsedUrl.href)
    ) {
      pino.info(
        'Unable to navigate to untrusted content url due to will-navigate listener: ',
        parsedUrl.href
      );
    }
  });

  /**
   * Security. Intercept new-window events (i.e. `window.open`) before opening
   * external links in the browser by overriding event.newGuest without using
   * the supplied options tag to try to mitigate risk of an exploit re-enabling
   * node integration despite being turned off in the configuration
   * (i.e. `nodeIntegration: false`).
   *
   * References:
   * - https://www.electronjs.org/blog/webview-fix
   * - https://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html
   */
  win.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();

      const parsedUrl = new URL(url);

      pino.info(
        'Processing request to navigate to url in new-window listener: ',
        parsedUrl.href
      );

      if (!TRUSTED_URLS.includes(parsedUrl.href) && !isTrustedUrlPattern(url)) {
        pino.info(
          'Unable to open new window with untrusted content url due to new-window listener: ',
          parsedUrl.href
        );

        return;
      }

      // FIXME - Note that we need to check for a valid certificate in 'certificate-error' event handler
      // so we only allow trusted content.
      // See https://electronjs.org/docs/tutorial/security#14-do-not-use-openexternal-with-untrusted-content
      shell.openExternal(url);
    }
  );

  // Security vulnerability fix https://electronjs.org/blog/window-open-fix
  win.on('-add-new-contents', event => {
    event.preventDefault();
  });
});

export { fetherApp };
