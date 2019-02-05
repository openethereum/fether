// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const withDebug = process.env.DEBUG === 'true';

function setupDebug (thatFA) {
  const { fetherApp } = thatFA;

  // Enable with `DEBUG=true yarn start` and access Developer Tools
  if (withDebug && fetherApp.options.webPreferences.devTools) {
    fetherApp.window.webContents.openDevTools();
  }
}

export default setupDebug;
