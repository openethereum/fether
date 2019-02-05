// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { screen } from 'electron';

import { getSavedWindowPosition, hasSavedWindowPosition } from '../settings';

import Pino from '../utils/pino';

const pino = Pino();

function showWindow (thatFA, trayPos) {
  const { fetherApp } = thatFA;

  if (!thatFA.window) {
    thatFA.createWindow();
  }

  fetherApp.emit('show-window');

  const calculatedWindowPosition = thatFA.calculateWindowPosition(trayPos);

  pino.info('Calculated window position: ', calculatedWindowPosition);

  const mainScreen = screen.getPrimaryDisplay();
  // const allScreens = screen.getAllDisplays();
  const mainScreenDimensions = mainScreen.size;
  const mainScreenWorkAreaSize = mainScreen.workAreaSize;

  // workAreaSize does not include the tray depth
  thatFA.trayDepth = Math.max(
    mainScreenDimensions.width - mainScreenWorkAreaSize.width,
    mainScreenDimensions.height - mainScreenWorkAreaSize.height
  );

  pino.info(
    'Previously saved window position exists: ',
    hasSavedWindowPosition()
  );

  const loadedWindowPosition = hasSavedWindowPosition()
    ? getSavedWindowPosition()
    : undefined;

  pino.info('Loaded window position: ', loadedWindowPosition);

  const fixedWindowPosition = thatFA.fixWindowPosition(loadedWindowPosition);

  pino.info('Fixed window position: ', fixedWindowPosition);

  /**
   * Since the user may change the tray to be on any side of the screen.
   * If the user moved the window out of where the tray would be in the screen resolution bounds.
   * Restore the window so it is fully visible adjacent to where the tray would be.
   */
  const x =
    (fixedWindowPosition && fixedWindowPosition.x) ||
    (loadedWindowPosition && loadedWindowPosition.x) ||
    calculatedWindowPosition.x;

  const y =
    (fixedWindowPosition && fixedWindowPosition.y) ||
    (loadedWindowPosition && loadedWindowPosition.y) ||
    calculatedWindowPosition.y;

  thatFA.window.setPosition(x, y);
  thatFA.window.show();

  fetherApp.emit('after-show-window');
}

export default showWindow;
