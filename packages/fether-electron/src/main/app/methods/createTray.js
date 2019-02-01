// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { Tray } from 'electron';

function createTray () {
  let { options } = this.fetherApp;

  if (options.withTaskbar) {
    this.fetherApp.tray = new Tray(options.icon);
  }
}

export default createTray;
