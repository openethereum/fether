// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
// https://www.npmjs.com/package/auto-launch
import AutoLaunch from 'auto-launch';

import Pino from '../../utils/pino';

const fetherAutoLauncher = new AutoLaunch({
  name: 'Fether'
});

const { shell } = electron;

const pino = Pino();

// Create the Application's main menu
// https://github.com/electron/electron/blob/master/docs/api/menu.md#examples
const getMenubarMenuTemplate = fetherApp => {
  // File menu
  const fileTab =
    process.platform === 'darwin'
      ? {
        label: 'File',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }
      : {
        label: 'File',
        submenu: [{ role: 'quit' }]
      };

  /**
   * On win32 we need to use `webContents` to make some of the menu items
   * functional (whereas it is not required on Linux and macOS).
   * i.e on macOS/Linux `{ role: 'undo' }` suffices to add the Undo menu item,
   * whereas on win32 we must use `webContents` as follows:
   * `{ label: 'Undo', click: () => fetherApp.win.webContents.undo() }`.
   * Since all items in the 'Edit' menu work with `webContents` we will use
   * it to prevent code duplication
   */
  const editTab = {
    label: 'Edit',
    submenu: [
      { label: 'Undo', click: () => fetherApp.win.webContents.undo() },
      { label: 'Redo', click: () => fetherApp.win.webContents.redo() },
      { type: 'separator' },
      { label: 'Cut', click: () => fetherApp.win.webContents.cut() },
      { label: 'Copy', click: () => fetherApp.win.webContents.copy() },
      { label: 'Paste', click: () => fetherApp.win.webContents.paste() },
      { type: 'separator' },
      { label: 'Delete', click: () => fetherApp.win.webContents.delete() },
      {
        label: 'Select All',
        click: () => fetherApp.win.webContents.selectAll()
      }
    ]
  };

  const viewTab = {
    label: 'View',
    submenu: [{ role: 'reload' }, { role: 'toggledevtools' }]
  };

  /**
   * On win32 we need to use `webContents` to make some of the menu items
   * functional (whereas it is not required on Linux and macOS).
   * Note that some menu items are not available in `webContents`
   * (i.e. resetzoom, zoomin, zoomout, togglefullscreen), however they
   * add no benefit to users anyway
   */
  const viewTabWindowsOS = {
    label: 'View',
    submenu: [
      { label: 'Reload', click: () => fetherApp.win.webContents.reload() },
      {
        label: 'Toggle Developer Tools',
        click: () => fetherApp.win.webContents.toggleDevTools()
      }
    ]
  };

  const windowTab = {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  };

  const helpTab = {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () {
          shell.openExternal('https://parity.io');
        }
      }
    ]
  };

  let template = [
    fileTab,
    editTab,
    process.platform === 'win32' ? viewTabWindowsOS : viewTab,
    windowTab,
    helpTab
  ];

  if (process.platform === 'darwin') {
    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
      }
    );
  }

  if (process.platform === 'darwin') {
    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  if (fetherApp.options.withTaskbar) {
    // Remove Window menu tab when running as taskbar app
    template.splice(3, 1);
  }

  return template;
};

const settingsLaunchOnStartup = shouldLaunchOnStartup => {
  return {
    openAtLogin: shouldLaunchOnStartup
    // TODO - configure additional properties
    // References:
    // - https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows
    // - https://github.com/electron-archive/grunt-electron-installer/issues/115
  };
};

const getIsLaunchOnStartup = fetherApp => {
  return fetherApp.app.getLoginItemSettings().openAtLogin || false;
};

const getContextMenuTemplate = fetherApp => {
  let isLaunchOnStartup;
  let template = getMenubarMenuTemplate(fetherApp);

  const menuItemLaunchOnStartup = {
    label: 'Launch On Startup',
    type: 'checkbox',
    checked: async () => {
      if (process.platform === 'linux') {
        isLaunchOnStartup = await fetherAutoLauncher.isEnabled();
        return isLaunchOnStartup;
      } else {
        return getIsLaunchOnStartup(fetherApp);
      }
    },
    async click () {
      if (process.platform === 'linux') {
        isLaunchOnStartup = await fetherAutoLauncher.isEnabled();
        isLaunchOnStartup
          ? await fetherAutoLauncher.disable()
          : await fetherAutoLauncher.enable();
        pino.info(
          'Set Launch Fether On Startup setting to: ',
          isLaunchOnStartup
        );
      } else {
        isLaunchOnStartup = getIsLaunchOnStartup(fetherApp);
        fetherApp.app.setLoginItemSettings(
          settingsLaunchOnStartup(!isLaunchOnStartup)
        );
        pino.info(
          'Set Launch Fether On Startup setting to: ',
          !isLaunchOnStartup
        );
      }
    }
  };

  if (fetherApp.options.withTaskbar) {
    // Remove File and Help menus in taskbar mode for context menu
    template.shift();
    template.pop();
    template.push({
      label: 'Preferences',
      submenu: [menuItemLaunchOnStartup]
    });
    template.push({
      role: 'help',
      submenu: [
        { role: 'about' },
        {
          label: 'Learn More',
          click () {
            shell.openExternal('https://parity.io');
          }
        }
      ]
    });
    template.push({ type: 'separator' });
    template.push({ label: 'Quit', role: 'quit' });
  }

  return template;
};

export { getMenubarMenuTemplate, getContextMenuTemplate };
