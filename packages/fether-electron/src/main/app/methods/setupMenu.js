// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { addMenu } from '../menu';
import Pino from '../utils/pino';

const pino = Pino();

function setupMenu (thatFA) {
  const { fetherApp } = thatFA;

  // Add application menu
  addMenu(fetherApp.window);
  pino.info('Finished configuring Electron menu');
}

export default setupMenu;
