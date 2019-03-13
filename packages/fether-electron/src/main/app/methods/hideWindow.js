// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function hideWindow (fetherApp) {
  const { processSaveWinPosition, win } = fetherApp;

  if (!win) {
    return;
  }

  processSaveWinPosition(fetherApp); // Save window position when hide, particularly necessary on Linux
  fetherApp.emit('hide-window');
  win.hide();
  fetherApp.emit('after-hide-window');
}

export default hideWindow;
