// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getContextTrayMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class FetherContextTrayMenu {
  constructor (fetherApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Fether context tray menu more than once'
      );
    }

    this.setMenuTemplate(getContextTrayMenuTemplate(fetherApp));
    this.buildMenuTemplate(this.menuTemplate);
  }

  setMenuTemplate = menuTemplate => {
    this.menuTemplate = menuTemplate;
  };

  buildMenuTemplate = menuTemplate => {
    this.builtMenu = Menu.buildFromTemplate(menuTemplate);
  };

  getMenu = () => {
    return this.builtMenu;
  };
}

export default FetherContextTrayMenu;
