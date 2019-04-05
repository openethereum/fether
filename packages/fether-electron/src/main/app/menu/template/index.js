// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';
import electron from 'electron';
import settings from 'electron-settings';
// https://www.npmjs.com/package/auto-launch
import AutoLaunch from 'auto-launch';

import Pino from '../../utils/pino';

// Only use 'auto-launch' library on Linux since Electron API's
// `setLoginItemSettings` is only supported on macOS and Windows
// https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows
const fetherAutoLauncher = new AutoLaunch({
  name: 'Fether',
  path: '/usr/local/bin/fether'
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

  /* eslint-disable no-sparse-arrays */
  const editTabMacOS = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },,
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  };
  /* eslint-enable no-sparse-arrays */

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

  const template = [
    fileTab,
    process.platform === 'darwin' ? editTabMacOS : editTab,
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

const execName = path.basename(process.execPath);
pino.info('Executable Name: ', execName);
pino.info('Executable Path: ', process.execPath);

const settingsLaunchOnStartup = shouldLaunchOnStartup => {
  if (process.platform === 'win32') {
    return {
      openAtLogin: shouldLaunchOnStartup,
      path: process.execPath, // Windows only
      args: [
        // Windows only
        '--processStart',
        `${execName}`,
        '--process-start-args',
        '--hidden'
      ]
      // TODO - configure additional properties
      // References:
      // - https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows
      // - https://github.com/electron-archive/grunt-electron-installer/issues/115
    };
  } else {
    return {
      openAtLogin: shouldLaunchOnStartup
    };
  }
};

const getIsLaunchOnStartup = fetherApp => {
  return fetherApp.app.getLoginItemSettings().openAtLogin;
};

const isChecked = fetherApp => {
  let isLaunchOnStartup;

  if (process.platform === 'linux') {
    isLaunchOnStartup = settings.get('launch-on-startup');
  } else {
    isLaunchOnStartup = getIsLaunchOnStartup(fetherApp);
  }

  pino.info('Set Launch on Startup checkbox to: ', isLaunchOnStartup);
  return isLaunchOnStartup;
};

const getContextTrayMenuTemplate = fetherApp => {
  if (fetherApp.options.withTaskbar) {
    const template = [
      {
        label: 'Show/Hide Fether',
        click () {
          if (fetherApp.win.isVisible() && fetherApp.win.isFocused()) {
            fetherApp.win.hide();
          } else {
            fetherApp.win.show();
            fetherApp.win.focus();
          }
        }
      }
    ];

    if (process.env.NODE_ENV !== 'production') {
      template.push({
        label: 'Reload',
        click: () => fetherApp.win.webContents.reload()
      });
    }

    template.push({ label: 'Quit', role: 'quit' });

    return template;
  }
};

const getContextWindowMenuTemplate = fetherApp => {
  const template = getMenubarMenuTemplate(fetherApp);

  // Set the checkbox value off in the context menu on first launch
  let isFirstLaunch = settings.has('launch-on-startup');

  const menuItemLaunchOnStartup = {
    label: 'Launch On Startup',
    type: 'checkbox',
    checked: isFirstLaunch ? false : isChecked(fetherApp),
    async click () {
      let isLaunchOnStartup;

      if (process.platform === 'linux') {
        isLaunchOnStartup = await fetherAutoLauncher.isEnabled();
        pino.info('Previous Launch on Startup setting: ', isLaunchOnStartup);
        isLaunchOnStartup
          ? await fetherAutoLauncher.disable()
          : await fetherAutoLauncher.enable();
        const newSetting = await fetherAutoLauncher.isEnabled();
        pino.info('New Launch on Startup setting: ', newSetting);
        /**
         * Hack since `checked` property is promise and unable to
         * assign it to result of resolved promise. Instead we store
         * the state using electron-settings. Only issue is that the
         * checked value shown in the UI will be incorrect the first
         * time the user runs the application, but after the user
         * the value and it starts using the electron-settings value
         * it will be correct.
         */
        settings.set('launch-on-startup', newSetting);
      } else {
        isLaunchOnStartup = getIsLaunchOnStartup(fetherApp);
        fetherApp.app.setLoginItemSettings(
          settingsLaunchOnStartup(!isLaunchOnStartup)
        );
      }

      pino.info('Set Launch On Startup setting to: ', !isLaunchOnStartup);
    }
  };

  isFirstLaunch = undefined;

  if (fetherApp.options.withTaskbar) {
    // Remove File and Help menus in taskbar mode for window context menu
    template.shift();
    template.pop();
    template.push({
      label: 'Preferences',
      submenu: [menuItemLaunchOnStartup]
    });

    template.push({
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () {
            shell.openExternal('https://parity.io');
          }
        }
      ]
    });

    template.push({ type: 'separator' });

    if (process.platform === 'darwin') {
      template[2].submenu.push({ role: 'about' });
    }

    template.push({ label: 'Quit', role: 'quit' });
  }

  return template;
};

export {
  getContextTrayMenuTemplate,
  getContextWindowMenuTemplate,
  getMenubarMenuTemplate
};
