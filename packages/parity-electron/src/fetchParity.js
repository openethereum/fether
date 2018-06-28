// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app } from 'electron';
import axios from 'axios';
import cs from 'checksum';
import debug from 'debug';
import { download } from 'electron-dl';
import fs from 'fs';
import { promisify } from 'util';
import retry from 'async-retry';

import { defaultParityPath, getParityPath } from './getParityPath';
import { name } from '../package.json';
import parityChannel from './utils/parityChannel';

const checksum = promisify(cs.file);
const logger = debug(`${name}:main`);
const fsChmod = promisify(fs.chmod);
const fsStat = promisify(fs.stat);
const fsUnlink = promisify(fs.unlink);

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
export const deleteParity = async () => {
  try {
    const parityPath = await defaultParityPath();
    await fsStat(parityPath);
    await fsUnlink(parityPath);
  } catch (e) {}
};

// Fetch parity from https://vanity-service.parity.io/parity-binaries
export const fetchParity = (mainWindow, onProgress) => {
  try {
    return retry(
      async (_, attempt) => {
        if (attempt > 1) {
          logger('Retrying.');
        }

        // Fetch the metadata of the correct version of parity
        const metadataUrl = `${VANITY_URL}?version=${parityChannel}&os=${getOs()}&architecture=${getArch()}`;
        logger(`Downloading from ${metadataUrl}.`);
        const { data } = await axios.get(metadataUrl);

        // Get the binary's url
        const { downloadUrl, checksum: expectedChecksum } = data[0].files.find(
          ({ name }) => name === 'parity' || name === 'parity.exe'
        );

        // Start downloading. This will install parity into defaultParityPath.
        const downloadItem = await download(mainWindow, downloadUrl, {
          directory: app.getPath('userData'),
          onProgress
        });
        const downloadPath = downloadItem.getSavePath(); // Equal to defaultParityPath

        // Once downloaded, we check the sha256 checksum
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
        const parityPath = await getParityPath();
        return parityPath;
      },
      {
        onRetry: async err => {
          debug(err);

          // Everytime we retry, we remove the parity file we just downloaded.
          // This needs to be done syncly normally, since onRetry is sync
          // https://github.com/zeit/async-retry/issues/43
          return deleteParity();
        },
        retries: 3
      }
    );
  } catch (err) {
    return deleteParity().then(() => {
      Promise.reject(err);
    });
  }
};
