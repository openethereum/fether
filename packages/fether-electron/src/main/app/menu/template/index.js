// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

const { app, shell } = electron;

// Create the Application's main menu
// https://github.com/electron/electron/blob/master/docs/api/menu.md#examples
export const getTemplate = fetherApp => {
  // File menu
  const fileTab =
    process.platform === 'darwin'
      ? {
        label: app.getName(),
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
        label: app.getName(),
        submenu: [{ role: 'quit' }]
      };

  const editTab = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  };

  const editTabWindowsOS = {
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
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  };

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
    process.platform === 'win32' ? editTabWindowsOS : editTab,
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
