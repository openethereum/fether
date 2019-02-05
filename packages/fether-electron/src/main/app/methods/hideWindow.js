// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function hideWindow (thatFA) {
  const { fetherApp } = thatFA;

  if (!fetherApp.window) {
    return;
  }

  thatFA.processSaveWindowPosition(); // Save window position when hide, particularly necessary on Linux

  fetherApp.emit('hide-window');
  fetherApp.window.hide();
  fetherApp.emit('after-hide-window');
}

export default hideWindow;
