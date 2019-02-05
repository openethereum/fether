// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function setupSecurity (thatFA) {
  const { fetherApp } = thatFA;

  // Security to prevent window contents from being captured by other apps
  fetherApp.window.setContentProtection(true);
}

export default setupSecurity;
