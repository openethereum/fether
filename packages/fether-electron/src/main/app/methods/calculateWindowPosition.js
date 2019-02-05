// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function calculateWindowPosition (thatFA, trayPos) {
  const { fetherApp } = thatFA;

  const { cachedBounds, options, positioner, tray } = fetherApp;

  if (trayPos && trayPos.x !== 0) {
    // Cache the bounds
    fetherApp.cachedBounds = trayPos;
  } else if (cachedBounds) {
    // Cached value will be used if showWindow is called without bounds data
    trayPos = cachedBounds;
  } else if (tray && tray.getBounds) {
    // Get the current tray bounds
    trayPos = tray.getBounds();
  }

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPosition = null;

  if (
    (trayPos === undefined || (trayPos && trayPos.x === 0)) &&
    options.windowPosition &&
    options.windowPosition.substr(0, 4) === 'tray'
  ) {
    noBoundsPosition =
      process.platform === 'win32' ? 'bottomRight' : 'topRight';
  }

  const position = positioner.calculate(
    noBoundsPosition || options.windowPosition,
    trayPos
  );

  return {
    x: options.x ? options.x : position.x,
    y: options.y ? options.y : position.y
  };
}

export default calculateWindowPosition;
