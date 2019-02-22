// Copyright 2015-2018 Parity Technologies (UK) Ltd.
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

    /**
     * On macOS we do not need context menu since taskbar menu permanently shown
     * If choose to use context menu on macOS then it exhibits strange behaviour
     * and only works when right-click to toggles Fether window, and single click
     * to toggles Fether menu (not the preferred way of the other way around).
     */
    if (process.platform !== 'darwin') {
      tray.setContextMenu(fetherApp.menu.getMenu());
    }

    // Right-click event listener does not work on Windows
    tray.on('right-click', () => {
      pino.info('Detected right-click on tray icon');

      if (process.platform !== 'darwin') {
        onTrayClick(fetherApp);
      }
    });

    // Single click event listener works on Windows
    tray.on('click', () => {
      pino.info('Detected single click on tray icon');

      // On win32, if the user clicks a menu item in the 'Edit' menu tab
      // of the Fether context menu after clicking the system tray icon
      // the menu items do not work because the Fether window is blurred,
      // so we need to regain focus on the Fether window for them to work
      if (process.platform === 'win32') {
        fetherApp.win.focus();
      }

      // On macOS we just use single click on tray icon to toggle Fether window.
      // and do not use the context menu since the menu is shown in the taskbar.
      if (process.platform !== 'darwin') {
        tray.popUpContextMenu();
      } else {
        onTrayClick(fetherApp);
      }
    });
    tray.setToolTip(options.tooltip);
    tray.setHighlightMode('never');
  }
}

export default loadTray;
