// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function onTrayClick (thatFA, e, bounds) {
  const { cachedBounds } = thatFA;

  if (
    e.altKey ||
    e.shiftKey ||
    e.ctrlKey ||
    e.metaKey ||
    (thatFA.window && thatFA.window.isVisible())
  ) {
    return thatFA.hideWindow();
  }

  // cachedBounds are needed for double-clicked event
  thatFA.cachedBounds = bounds || cachedBounds;
  thatFA.showWindow(thatFA.cachedBounds);
}

export default onTrayClick;
