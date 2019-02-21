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
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' }
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

  let template = [fileTab, editTab, viewTab, windowTab, helpTab];

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
    if (process.platform === 'darwin') {
      // Remove 'close' and 'minimize' options when running as taskbar app
      template[3].submenu.splice(0, 2);
    } else {
      // Remove Window menu tab on non-macOS when running as taskbar app
      template.splice(3, 1);
    }
  }

  return template;
};
