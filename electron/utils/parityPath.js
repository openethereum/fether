// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');

const parityPath = `${app.getPath('userData')}/parity${
  process.platform === 'win32' ? '.exe' : ''
}`;

module.exports = () => parityPath;
