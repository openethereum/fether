// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function windowClear (fetherApp) {
  const { emit, win } = fetherApp;

  if (win) {
    // Remove relevant events when window object deleted
    const events = ['close', 'move', 'moved', 'resize'];
    for (let event in events) {
      win.removeAllListeners(event);
    }
    delete fetherApp.win;
  }

  fetherApp.emit('after-close-window');
}

export default windowClear;
