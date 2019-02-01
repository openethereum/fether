// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function onTrayClick (e, bounds) {
  const { cachedBounds, window } = this.fetherApp;

  if (
    e.altKey ||
    e.shiftKey ||
    e.ctrlKey ||
    e.metaKey ||
    (window && window.isVisible())
  ) {
    return this.hideWindow();
  }

  // cachedBounds are needed for double-clicked event
  this.fetherApp.cachedBounds = bounds || cachedBounds;
  this.showWindow(this.fetherApp.cachedBounds);
}

export default onTrayClick;
