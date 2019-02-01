// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { productName } from '../../../../electron-builder.json';
import { getSavedWindowPosition } from '../settings';
import Pino from '../utils/pino';

const pino = Pino();

function setupAppListeners () {
  this.fetherApp.on('create-app', () => {
    pino.info(
      `Starting ${productName} (${
        this.fetherApp.options.withTaskbar ? 'with' : 'without'
      } tray icon)...`
    );
  });

  this.fetherApp.on('create-window', () => {
    pino.info('Creating window');
  });

  this.fetherApp.on('after-create-window', () => {
    pino.info('Finished creating window');
  });

  this.fetherApp.on('load-tray', () => {
    pino.info('Configuring taskbar mode for the window');
  });

  this.fetherApp.on('show-window', () => {
    pino.info('Showing window');
  });

  this.fetherApp.on('after-show-window', () => {
    pino.info('Finished showing window');
  });

  this.fetherApp.on('after-create-app', () => {
    pino.info(`Ready to use ${productName}`);
  });

  this.fetherApp.on('hide-window', () => {
    pino.info('Hiding window on blur since not on top');
  });

  this.fetherApp.on('after-hide-window', () => {
    pino.info('Finished hiding window');
  });

  this.fetherApp.on('blur-window', () => {
    pino.info('Blur window since lost focus when on top');
  });

  this.fetherApp.on('after-moved-window-position-saved', () => {
    const position = getSavedWindowPosition();

    pino.info(
      `Saved window position to (x: ${position.x}, y: ${position.y}) after move`
    );
  });

  this.fetherApp.on('moved-window-up-into-view', () => {
    pino.info('Moved window up into view');
  });

  this.fetherApp.on('after-close-window', () => {
    pino.info('Deleted window upon close');
  });

  this.fetherApp.on('error', error => {
    console.error(error);
  });
}

export default setupAppListeners;
