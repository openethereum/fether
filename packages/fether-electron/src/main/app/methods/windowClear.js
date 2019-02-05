// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function windowClear (thatFA) {
  const { fetherApp } = thatFA;

  if (thatFA.window) {
    // Remove relevant events when window object deleted
    const events = ['close', 'move', 'moved', 'resize'];
    for (let event in events) {
      thatFA.window.removeAllListeners(event);
    }
    delete thatFA.window;
  }

  fetherApp.emit('after-close-window');
}

export default windowClear;
