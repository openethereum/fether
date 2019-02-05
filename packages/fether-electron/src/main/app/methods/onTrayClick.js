// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function onTrayClick (thatFA, e, bounds) {
  const { fetherApp } = thatFA;

  const { cachedBounds, window } = fetherApp;

  if (
    e.altKey ||
    e.shiftKey ||
    e.ctrlKey ||
    e.metaKey ||
    (window && window.isVisible())
  ) {
    return thatFA.hideWindow();
  }

  // cachedBounds are needed for double-clicked event
  fetherApp.cachedBounds = bounds || cachedBounds;
  thatFA.showWindow(fetherApp.cachedBounds);
}

export default onTrayClick;
