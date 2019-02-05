// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function loadTray (thatFA) {
  const { fetherApp } = thatFA;

  const { app, options, tray } = fetherApp;

  if (options.withTaskbar) {
    fetherApp.emit('load-tray');

    if (process.platform === 'darwin' && app.dock && !options.showDockIcon) {
      app.dock.hide();
    }

    const defaultClickEvent = options.showOnRightClick
      ? 'right-click'
      : 'click';

    // Note: See https://github.com/RocketChat/Rocket.Chat.Electron/issues/44
    if (process.platform === 'win32') {
      thatFA.showTrayBalloon();
    }

    tray.on(defaultClickEvent, () => thatFA.onTrayClick(fetherApp));
    tray.on('double-click', () => thatFA.onTrayClick(fetherApp));
    // Right click event handler does not work on Windows as intended
    tray.on('right-click', () => {
      if (process.platform === 'win32') {
        pino.info('Detected right click on Windows');
        thatFA.showTrayBalloon();
      }
    });
    tray.setToolTip(options.tooltip);
    tray.setHighlightMode('never');
  }
}

export default loadTray;
