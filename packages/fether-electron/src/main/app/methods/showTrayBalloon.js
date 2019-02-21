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

function showTrayBalloon (fetherApp) {
  const { tray } = fetherApp;

  pino.info('Showing Tray Balloon');

  tray.displayBalloon({
    content: `'Left-click or right-click tray icon toggles Fether window or Fether menu'`,
    icon: iconBalloonPath,
    title: 'Fether Window and Menu'
  });
}

export default showTrayBalloon;
