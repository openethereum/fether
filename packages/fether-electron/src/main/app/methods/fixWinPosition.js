// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/**
 * Proposes a fixed window position that may be used if the window is moved
 * out of the screen bounds threshold. If the window is moved across to a
 * second monitor (without screen mirroring) then if the screen is hidden
 * and then shown again (by pressing the Fether tray icon), since the
 * coordinates of the window are outside the screen bounds the window
 * will be restored into the users primary screen.
 */
function fixWinPosition (fetherApp, proposedWindowPosition) {
  const { trayDepth, win } = fetherApp;

  if (!proposedWindowPosition) {
    return;
  }

  const newPosition = { x: undefined, y: undefined };
  const resolution = fetherApp.getScreenResolution();
  const winWidth = win.getSize()[0];
  const winHeight = win.getSize()[1];

  if (proposedWindowPosition.x < trayDepth) {
    newPosition.x = trayDepth;
  }

  if (proposedWindowPosition.y < trayDepth) {
    newPosition.y = trayDepth;
  }

  if (proposedWindowPosition.x >= resolution.x - winWidth - trayDepth) {
    newPosition.x = resolution.x - winWidth - trayDepth;
  }

  if (proposedWindowPosition.y >= resolution.y - winHeight - trayDepth) {
    newPosition.y = resolution.y - winHeight - trayDepth;
  }

  return newPosition;
}

export default fixWinPosition;
