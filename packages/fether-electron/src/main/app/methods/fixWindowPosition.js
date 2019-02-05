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
function fixWindowPosition (fetherApp, proposedWindowPosition) {
  const { trayDepth } = fetherApp;

  if (!proposedWindowPosition) {
    return;
  }

  const newPosition = {
    x: undefined,
    y: undefined
  };

  const currentScreenResolution = fetherApp.getScreenResolution();

  const windowWidth = fetherApp.window.getSize()[0];
  const windowHeight = fetherApp.window.getSize()[1];

  if (proposedWindowPosition.x < trayDepth) {
    newPosition.x = trayDepth;
  }

  if (proposedWindowPosition.y < trayDepth) {
    newPosition.y = trayDepth;
  }

  if (
    proposedWindowPosition.x >=
    currentScreenResolution.x - windowWidth - trayDepth
  ) {
    newPosition.x = currentScreenResolution.x - windowWidth - trayDepth;
  }

  if (
    proposedWindowPosition.y >=
    currentScreenResolution.y - windowHeight - trayDepth
  ) {
    newPosition.y = currentScreenResolution.y - windowHeight - trayDepth;
  }

  return newPosition;
}

export default fixWindowPosition;
