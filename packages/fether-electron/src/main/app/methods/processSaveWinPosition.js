// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  getChangedScreenResolution,
  shouldFixWindowPosition
} from '../utils/window';
import { saveWindowPosition } from '../settings';

function processSaveWinPosition (fetherApp) {
  const {
    fixWinPosition,
    getScreenResolution,
    previousScreenResolution,
    win
  } = fetherApp;

  if (!win) {
    return;
  }

  const resolution = getScreenResolution();

  fetherApp.previousScreenResolution = getChangedScreenResolution(
    previousScreenResolution,
    resolution
  );

  // Get the latest position. The window may have been moved to a different
  // screen with smaller resolution. We must move it to prevent cropping.
  const position = win.getPosition();

  const positionStruct = { x: position[0], y: position[1] };

  const fixedWinPosition = fixWinPosition(fetherApp, positionStruct);

  const newFixedPosition = {
    x: fixedWinPosition.x || positionStruct.x,
    y: fixedWinPosition.y || positionStruct.y
  };

  /**
   * Only move it immediately back into the threshold of screen tray bounds
   * to prevent it from being cropped if the screen resolution is reduced.
   * Do not call this all the time otherwise it will crash with
   * a call stack exceeded if the user keeps trying to move it outside the screen bounds
   * and it would also prevent the user from moving it to a different screen at all.
   */
  if (shouldFixWindowPosition(previousScreenResolution, resolution)) {
    // Move window to the fixed x-coordinate position if that required fixing
    if (fixedWinPosition.x) {
      win.setPosition(fixedWinPosition.x, positionStruct.y, true);
    }

    // Move window to the fixed y-coordinate position if that required fixing
    if (fixedWinPosition.y) {
      win.setPosition(positionStruct.x, fixedWinPosition.y, true);
    }
  }

  saveWindowPosition(newFixedPosition || positionStruct);
  fetherApp.emit('after-moved-window-position-saved');
}

export default processSaveWinPosition;
