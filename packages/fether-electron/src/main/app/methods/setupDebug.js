// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const withDebug = process.env.DEBUG === 'true';

function setupDebug (fetherApp) {
  const { options, win } = fetherApp;
  // Enable with `DEBUG=true yarn start` and access Developer Tools
  if (withDebug && options.webPreferences.devTools) {
    win.webContents.openDevTools();
  }
}

export default setupDebug;
