// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { productName } from '../../../../electron-builder.json';
import { getSavedWindowPosition } from '../settings';
import Pino from '../utils/pino';

const pino = Pino();

function setupAppListeners (fetherApp) {
  fetherApp.on('create-app', () => {
    pino.info(
      `Starting ${productName} (${
        fetherApp.options.withTaskbar ? 'with' : 'without'
      } tray icon)...`
    );
  });

  fetherApp.on('create-window', () => {
    pino.info('Creating window');
  });

  fetherApp.on('after-create-window', () => {
    pino.info('Finished creating window');
  });

  fetherApp.on('load-tray', () => {
    pino.info('Configuring taskbar mode for the window');
  });

  fetherApp.on('show-window', () => {
    pino.info('Showing window');
  });

  fetherApp.on('after-show-window', () => {
    pino.info('Finished showing window');
  });

  fetherApp.on('after-create-app', () => {
    pino.info(`Ready to use ${productName}`);
  });

  fetherApp.on('hide-window', () => {
    pino.info('Hiding window on blur since not on top');
  });

  fetherApp.on('after-hide-window', () => {
    pino.info('Finished hiding window');
  });

  fetherApp.on('blur-window', () => {
    pino.info('Blur window since lost focus when on top');
  });

  fetherApp.on('after-moved-window-position-saved', () => {
    const position = getSavedWindowPosition();

    pino.info(
      `Saved window position to (x: ${position.x}, y: ${position.y}) after move`
    );
  });

  fetherApp.on('moved-window-up-into-view', () => {
    pino.info('Moved window up into view');
  });

  fetherApp.on('after-close-window', () => {
    pino.info('Deleted window upon close');
  });

  fetherApp.on('error', error => {
    console.error(error);
  });
}

export default setupAppListeners;
