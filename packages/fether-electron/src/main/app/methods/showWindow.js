// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { screen } from 'electron';

import { getSavedWindowPosition, hasSavedWindowPosition } from '../settings';

import Pino from '../utils/pino';

const pino = Pino();

function showWindow (fetherApp, trayPos) {
  const {
    calculateWinPosition,
    createWindow,
    fixWinPosition,
    setupWinListeners,
    setupWin32Listeners,
    win
  } = fetherApp;

  pino.info('Showing window id: ', fetherApp.win && fetherApp.win.id);

  if (!win) {
    createWindow(fetherApp);
  }

  fetherApp.emit('show-window');

  const calculatedWinPosition = calculateWinPosition(fetherApp, trayPos);

  pino.info('Calculated window position: ', calculatedWinPosition);

  const mainScreen = screen.getPrimaryDisplay();
  // const allScreens = screen.getAllDisplays();
  const mainScreenDims = mainScreen.size;
  const mainScreenWorkAreaSize = mainScreen.workAreaSize;

  // workAreaSize does not include the tray depth
  fetherApp.trayDepth = Math.max(
    mainScreenDims.width - mainScreenWorkAreaSize.width,
    mainScreenDims.height - mainScreenWorkAreaSize.height
  );

  pino.info(
    'Previously saved window position exists: ',
    hasSavedWindowPosition()
  );

  const loadedWindowPosition = hasSavedWindowPosition()
    ? getSavedWindowPosition()
    : undefined;

  pino.info('Loaded window position: ', loadedWindowPosition);

  const fixedWinPosition = fixWinPosition(fetherApp, loadedWindowPosition);

  pino.info('Fixed window position: ', fixedWinPosition);

  /**
   * Since the user may change the tray to be on any side of the screen.
   * If the user moved the window out of where the tray would be in the screen resolution bounds.
   * Restore the window so it is fully visible adjacent to where the tray would be.
   */
  const x =
    (fixedWinPosition && fixedWinPosition.x) ||
    (loadedWindowPosition && loadedWindowPosition.x) ||
    calculatedWinPosition.x;

  const y =
    (fixedWinPosition && fixedWinPosition.y) ||
    (loadedWindowPosition && loadedWindowPosition.y) ||
    calculatedWinPosition.y;

  fetherApp.win.setPosition(x, y);
  fetherApp.win.show();

  if (!fetherApp.hasSetupWinListeners) {
    setupWinListeners(fetherApp);
    setupWin32Listeners(fetherApp);

    fetherApp.hasSetupWinListeners = true;
  }

  fetherApp.emit('after-show-window');
}

export default showWindow;
