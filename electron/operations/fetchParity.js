// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app, dialog } = require('electron');
const axios = require('axios');
const { download } = require('electron-dl');
const fs = require('fs');
const util = require('util');

const {
  parity: { channel }
} = require('../../package.json');
const parityPath = require('../utils/parityPath');

const fsExists = util.promisify(fs.stat);
const fsChmod = util.promisify(fs.chmod);

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

module.exports = mainWindow => {
  // Download parity if not exist in userData
  // Fetching from https://vanity-service.parity.io/parity-binaries
  return fsExists(parityPath())
    .catch(() =>
      axios
        .get(
          `https://vanity-service.parity.io/parity-binaries?version=${channel}&os=${getOs()}&architecture=${getArch()}`
        )
        .then(response =>
          response.data[0].files.find(
            ({ name }) => name === 'parity' || name === 'parity.exe'
          )
        )
        .then(({ downloadUrl }) =>
          download(mainWindow, downloadUrl, {
            directory: app.getPath('userData'),
            onProgress: progress =>
              mainWindow.webContents.send('parity-download-progress', progress) // Notify the renderers
          })
        )
    )
    .then(() => fsChmod(parityPath(), '755'))
    .catch(err => {
      handleError(err, 'An error occured while fetching parity.');
    });
};
