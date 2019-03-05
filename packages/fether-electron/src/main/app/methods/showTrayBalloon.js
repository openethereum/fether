// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';

import { staticPath } from '../utils/paths';
import Pino from '../utils/pino';

const iconBalloonPath = path.join(
  staticPath,
  'assets',
  'icons',
  'win',
  'iconBalloon.png'
);

const pino = Pino();

// Supported only on Windows OS
function showTrayBalloon (fetherApp) {
  const { tray } = fetherApp;

  pino.info('Showing Tray Balloon');

  tray.displayBalloon({
    content:
      'Click to toggle Fether window. Right-click Fether window to toggle Fether menu',
    icon: iconBalloonPath,
    title: 'Fether Window & Menu Usage'
  });
}

export default showTrayBalloon;
