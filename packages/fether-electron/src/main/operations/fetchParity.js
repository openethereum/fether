// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app } from 'electron';
import axios from 'axios';
import cs from 'checksum';
import { download } from 'electron-dl';
import fs from 'fs';
import { promisify } from 'util';
import retry from 'async-retry';

import { defaultParityPath, doesParityExist } from './doesParityExist';
import handleError from './handleError';
import { parity } from '../../../package.json';
import Pino from '../utils/pino';

const checksum = promisify(cs.file);
const fsChmod = promisify(fs.chmod);
const pino = Pino();

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

/**
 * Remove parity binary in the userData folder
 */
const deleteParity = () => {
  if (fs.statSync(defaultParityPath)) {
    fs.unlinkSync(defaultParityPath);
  }
};

// Fetch parity from https://vanity-service.parity.io/parity-binaries
export default mainWindow => {
  try {
    return retry(
      async (_, attempt) => {
        if (attempt > 1) {
          pino.warn(`Retrying.`);
        }

        // Fetch the metadata of the correct version of parity
        pino.info(
          `Downloading from ${VANITY_URL}?version=${
            parity.channel
          }&os=${getOs()}&architecture=${getArch()}.`
        );
        const { data } = await axios.get(
          `${VANITY_URL}?version=${
            parity.channel
          }&os=${getOs()}&architecture=${getArch()}`
        );

        // Get the binary's url
        const { downloadUrl } = data[0].files.find(
          ({ name }) => name === 'parity' || name === 'parity.exe'
        );

        // Start downloading. This will install parity into defaultParityPath.
        const downloadItem = await download(mainWindow, downloadUrl, {
          directory: app.getPath('userData'),
          onProgress: progress =>
            // Notify the renderers
            mainWindow.webContents.send('parity-download-progress', progress)
        });
        const downloadPath = downloadItem.getSavePath(); // Equal to defaultParityPath

        // Once downloaded, we fetch the sha256 checksum
        const { downloadUrl: checksumDownloadUrl } = data[0].files.find(
          ({ name }) => name === 'parity.sha256' || name === 'parity.exe.sha256'
        );
        const { data: checksumData } = await axios.get(checksumDownloadUrl);
        // Downloaded checksumData is in the format: "{checksum} {filename}"
        const [expectedChecksum] = checksumData.split(' ');
        // Calculate the actual checksum
        const actualChecksum = await checksum(downloadPath, {
          algorithm: 'sha256'
        });
        // The 2 checksums should of course match
        if (expectedChecksum !== actualChecksum) {
          throw new Error(
            `Checksum mismatch, expecting ${expectedChecksum}, got ${actualChecksum}.`
          );
        }

        // Set a+x permissions on the downloaded binary
        await fsChmod(downloadPath, '755');

        // Double-check that Parity exists now.
        return doesParityExist();
      },
      {
        onRetry: err => {
          pino.warn(err);

          // Everytime we retry, we remove the parity file we just downloaded.
          // This needs to be done syncly, since onRetry is sync
          deleteParity();
        },
        retries: 3
      }
    );
  } catch (err) {
    deleteParity();
    handleError(err, 'An error occured while fetching parity.');
  }
};
