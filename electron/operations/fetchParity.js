// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const axios = require('axios');
const { download } = require('electron-dl');
const fs = require('fs');
const { promisify } = require('util');
const retry = require('async-retry');

const { doesParityExist } = require('./doesParityExist');
const handleError = require('./handleError');
const { parity: { channel } } = require('../../package.json');
const pino = require('../utils/pino')({ name: 'electron' });

const fsChmod = promisify(fs.chmod);

const VANITY_URL = 'https://vanity-service.parity.io/parity-binaries';

const getArch = () => {
  switch (process.platform) {
    case 'darwin':
    case 'win32':
      return 'x86_64';
    default: {
      switch (process.arch) {
        case 'arm':
          return 'arm';
        case 'arm64':
          return 'aarch64';
        case 'x32':
          return 'i686';
        default:
          return 'x86_64';
      }
    }
  }
};

const getOs = () => {
  switch (process.platform) {
    case 'darwin':
      return 'darwin';
    case 'win32':
      return 'windows';
    default:
      return 'linux';
  }
};

// Fetch parity from https://vanity-service.parity.io/parity-binaries
module.exports = mainWindow => {
  try {
    return retry(
      async (_, attempt) => {
        if (attempt > 1) {
          pino.warn(`Retrying.`);
        }

        // Fetch the metadata of the correct version of parity
        pino.info(
          `Downloading from ${VANITY_URL}?version=${channel}&os=${getOs()}&architecture=${getArch()}`
        );
        const { data } = await axios.get(
          `${VANITY_URL}?version=${channel}&os=${getOs()}&architecture=${getArch()}`
        );

        // Get the binary's url
        const { downloadUrl } = data[0].files.find(
          ({ name }) => name === 'parity' || name === 'parity.exe'
        );

        // Start downloading. This will install parity into defaultParityPath().
        const downloadItem = await download(mainWindow, downloadUrl, {
          directory: app.getPath('userData'),
          onProgress: progress =>
            // Notify the renderers
            mainWindow.webContents.send('parity-download-progress', progress)
        });

        // Set a+x permissions on the downloaded binary
        await fsChmod(downloadItem.getSavePath(), '755');

        // Double-check that Parity exists now.
        return doesParityExist();
      },
      {
        retries: 3
      }
    );
  } catch (err) {
    handleError(err, 'An error occured while fetching parity.');
  }
};
