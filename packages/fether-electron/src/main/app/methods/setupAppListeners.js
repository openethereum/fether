// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { productName } from '../../../../electron-builder.json';
import { getSavedWindowPosition } from '../settings';
import Pino from '../utils/pino';

const pino = Pino();

function setupAppListeners (thatFA) {
  thatFA.fetherApp.on('create-app', () => {
    pino.info(
      `Starting ${productName} (${
        thatFA.options.withTaskbar ? 'with' : 'without'
      } tray icon)...`
    );
  });

  thatFA.fetherApp.on('create-window', () => {
    pino.info('Creating window');
  });

  thatFA.fetherApp.on('after-create-window', () => {
    pino.info('Finished creating window');
  });

  thatFA.fetherApp.on('load-tray', () => {
    pino.info('Configuring taskbar mode for the window');
  });

  thatFA.fetherApp.on('show-window', () => {
    pino.info('Showing window');
  });

  thatFA.fetherApp.on('after-show-window', () => {
    pino.info('Finished showing window');
  });

  thatFA.fetherApp.on('after-create-app', () => {
    pino.info(`Ready to use ${productName}`);
  });

  thatFA.fetherApp.on('hide-window', () => {
    pino.info('Hiding window on blur since not on top');
  });

  thatFA.fetherApp.on('after-hide-window', () => {
    pino.info('Finished hiding window');
  });

  thatFA.fetherApp.on('blur-window', () => {
    pino.info('Blur window since lost focus when on top');
  });

  thatFA.fetherApp.on('after-moved-window-position-saved', () => {
    const position = getSavedWindowPosition();

    pino.info(
      `Saved window position to (x: ${position.x}, y: ${position.y}) after move`
    );
  });

  thatFA.fetherApp.on('moved-window-up-into-view', () => {
    pino.info('Moved window up into view');
  });

  thatFA.fetherApp.on('after-close-window', () => {
    pino.info('Deleted window upon close');
  });

  thatFA.fetherApp.on('error', error => {
    console.error(error);
  });
}

export default setupAppListeners;
