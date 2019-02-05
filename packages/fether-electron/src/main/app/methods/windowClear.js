// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function windowClear (fetherApp) {
  if (fetherApp.window) {
    // Remove relevant events when window object deleted
    const events = ['close', 'move', 'moved', 'resize'];
    for (let event in events) {
      fetherApp.window.removeAllListeners(event);
    }
    delete fetherApp.window;
  }

  fetherApp.emit('after-close-window');
}

export default windowClear;
