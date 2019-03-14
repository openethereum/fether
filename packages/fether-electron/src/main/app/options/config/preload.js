// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const { ipcRenderer, remote } = require('electron');

// Make the `electron` object available in renderers
// https://github.com/electron/electron/issues/9920#issuecomment-336757899
window.electron = {
  ipcRenderer,
  remote
};
