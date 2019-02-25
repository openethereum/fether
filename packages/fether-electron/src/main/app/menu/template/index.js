// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

const { shell } = electron;

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

const getContextTrayMenuTemplate = fetherApp => {
  if (fetherApp.options.withTaskbar) {
    const template = [
      {
        label: 'Show/Hide Fether',
        click () {
          fetherApp.win.isVisible()
            ? fetherApp.win.hide()
            : fetherApp.win.show();
        }
      },
      { label: 'Quit', role: 'quit' }
    ];

    return template;
  }
};

const getContextWindowMenuTemplate = fetherApp => {
  let template = getMenubarMenuTemplate(fetherApp);

  if (fetherApp.options.withTaskbar) {
    // Remove File and Help menus in taskbar mode for window context menu
    template.shift();
    template.pop();
    template.push();
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
    template.push({ label: 'Quit', role: 'quit' });
  }

  return template;
};

export {
  getContextTrayMenuTemplate,
  getContextWindowMenuTemplate,
  getMenubarMenuTemplate
};
