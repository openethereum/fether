// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';

import staticPath from '../utils/staticPath';
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
      'Click tray icon to toggle Fether menu. Click dock icon to toggle Fether window',
    icon: iconBalloonPath,
    title: 'Fether Window & Menu Usage'
  });
}

export default showTrayBalloon;
