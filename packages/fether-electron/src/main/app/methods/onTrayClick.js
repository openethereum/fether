// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function onTrayClick (fetherApp, e, bounds) {
  const { cachedBounds } = fetherApp;

  if (
    e.altKey ||
    e.shiftKey ||
    e.ctrlKey ||
    e.metaKey ||
    (fetherApp.window && fetherApp.window.isVisible())
  ) {
    return fetherApp.hideWindow();
  }

  // cachedBounds are needed for double-clicked event
  fetherApp.cachedBounds = bounds || cachedBounds;
  fetherApp.showWindow(fetherApp.cachedBounds);
}

export default onTrayClick;
