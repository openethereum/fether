// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import parseUrl from 'parse-url';
import { killParity } from '@parity/electron';

import Pino from './app/utils/pino';
import FetherApp from './app';
import { TRUSTED_URLS } from './app/constants';
import fetherAppOptions from './app/options';

const { app, shell } = electron;
const pino = Pino();

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

/**
 * Security. Insecure TLS Validation - verify the application does not explicitly opt-out
 * of TLS validation.
 *
 * Reference: https://doyensec.com/resources/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
 */
app.on(
  'certificate-error',
  (event, webContents, url, error, certificate, callback) => {
    // Prevent default behaviour of continuing to load the page
    event.preventDefault();

    let isValidCertificate = false;

    // FIXME - in development environment validate own certificate,
    // either self-signed or signed by a local root,
    // that has been trusted in the trust store of the OS.
    //
    // Reference: https://letsencrypt.org/docs/certificates-for-localhost/

    if (isValidCertificate) {
      callback(true); // eslint-disable-line
    } else {
      // Disallow insecure (invalid) certificates
      callback(false); // eslint-disable-line
    }
  }
);

// FIXME - uncomment and show how Linux users may create a valid certificate
// and perhaps access it using an environment variable

// /**
//  * Security. Verify custom TLS certificates imported into the platform
//  * certificate store on Linux.
//  *
//  * Reference: Page 13 of https://doyensec.com/resources/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
//  */
// if (!['darwin', 'win32'].includes(process.platform)) {
//   const options = {
//     certificate: CERTIFICATE_PKCS12_FILE_PATH,
//     password: CERTIFICATE_PASSPHRASE
//   };

//   // Reference: https://electronjs.org/docs/all#appimportcertificateoptions-callback-linux
//   app.importCertificate(options, importCertificateResult => {
//     const isValidCertificate = importCertificateResult === 0;

//     return isValidCertificate;
//   });
// }

// Security
app.on('web-contents-created', (eventOuter, win) => {
  win.on('will-navigate', (event, url) => {
    // FIXME - check that parser is memory-safe
    //
    // Reference: https://letsencrypt.org/docs/certificates-for-localhost/

    const parsedUrl = parseUrl(url);

    pino.debug(
      'Processing request to navigate to url in will-navigate listener: ',
      parsedUrl
    );

    if (!TRUSTED_URLS.includes(parsedUrl.origin)) {
      pino.info(
        'Unable to navigate to untrusted content url due to will-navigate listener: ',
        parsedUrl
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

      // FIXME - Checking for and only allow opening trusted urls

      const parsedUrl = parseUrl(url);

      pino.debug(
        'Processing request to navigate to url in new-window listener: ',
        parsedUrl
      );

      if (!TRUSTED_URLS.includes(parsedUrl.origin)) {
        pino.info(
          'Unable to open new window with untrusted content url due to new-window listener: ',
          parsedUrl
        );

        return;
      }

      // Note that we check for a valid certificate in 'certificate-error' event handler
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
