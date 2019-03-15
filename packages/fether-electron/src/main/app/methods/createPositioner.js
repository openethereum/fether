// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Positioner from 'electron-positioner';

function createPositioner (fetherApp) {
  fetherApp.positioner = new Positioner(fetherApp.win);
}

export default createPositioner;
