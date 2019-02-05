// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Positioner from 'electron-positioner';

function createPositioner (thatFA) {
  const { fetherApp } = thatFA;

  fetherApp.positioner = new Positioner(fetherApp.window);
}

export default createPositioner;
