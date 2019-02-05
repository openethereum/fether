// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// Optionally update the progress bar shown on the Dock icon
// (i.e. 0.1 is 10%, 1.0 is 100%, -1 hides progress bar).
// Optionally emit event
function updateProgress (thatFA, percentage, eventListenerName) {
  const { fetherApp } = thatFA;

  if (percentage) {
    thatFA.window.setProgressBar(percentage);
  }

  if (eventListenerName) {
    fetherApp.emit(eventListenerName);
  }
}

export default updateProgress;
