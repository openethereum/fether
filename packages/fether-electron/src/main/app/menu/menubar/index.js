// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getMenubarMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class FetherMenubarMenu {
  constructor (fetherApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Fether menubar menu more than once'
      );
    }

    this.setMenuTemplate(getMenubarMenuTemplate(fetherApp));
    this.buildMenuTemplate(this.menuTemplate);
  }

  setMenuTemplate = menuTemplate => {
    this.menuTemplate = menuTemplate;
  };

  buildMenuTemplate = menuTemplate => {
    this.builtMenu = Menu.buildFromTemplate(menuTemplate);
  };

  setMenu = customBuiltMenuTemplate => {
    Menu.setApplicationMenu(customBuiltMenuTemplate || this.builtMenu);
  };

  getMenu = () => {
    // return Menu.getApplicationMenu();
    return this.builtMenu;
  };
}

export default FetherMenubarMenu;
