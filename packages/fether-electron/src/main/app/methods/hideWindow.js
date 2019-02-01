// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function hideWindow () {
  if (!this.fetherApp.window) {
    return;
  }

  this.processSaveWindowPosition(); // Save window position when hide, particularly necessary on Linux

  this.fetherApp.emit('hide-window');
  this.fetherApp.window.hide();
  this.fetherApp.emit('after-hide-window');
}

export default hideWindow;
