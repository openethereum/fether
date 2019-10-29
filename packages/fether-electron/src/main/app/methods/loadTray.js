// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function loadTray (fetherApp) {
  const { app, onTrayClick, options, showTrayBalloon, tray } = fetherApp;

  if (options.withTaskbar) {
    fetherApp.emit('load-tray');

    if (process.platform === 'darwin' && app.dock && !options.showDockIcon) {
      app.dock.hide();
    }

    // Note: See https://github.com/RocketChat/Rocket.Chat.Electron/issues/44
    if (process.platform === 'win32') {
      showTrayBalloon(fetherApp);
    }

    tray.setContextMenu(fetherApp.contextTrayMenu.getMenu());

    // Right-click event listener does not work on Windows
    tray.on('right-click', () => {
      pino.info('Detected right-click on tray icon');

      tray.popUpContextMenu();
      fetherApp.win.focus();
    });

    // Single click event listener works on Windows
    tray.on('click', () => {
      pino.info('Detected single click on tray icon');

      onTrayClick(fetherApp);
      fetherApp.win.focus();
    });
    tray.setToolTip(options.tooltip);
  }
}

export default loadTray;
