// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function showTrayBalloon () {
  let { tray } = this.fetherApp;

  pino.info('Showing Tray Balloon');

  tray.displayBalloon({
    title: 'Fether Menu',
    content: `Press ALT in the Fether window to toggle the menu`
  });
}

export default showTrayBalloon;
