// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import parityElectron from '@parity/electron';

import Pino from '../utils/pino';

function setupLogger () {
  // Set options for @parity/electron
  parityElectron({
    logger: namespace => log => Pino({ name: namespace }).info(log)
  });
}

export default setupLogger;
