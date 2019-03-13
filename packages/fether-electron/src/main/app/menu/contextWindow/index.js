// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getContextWindowMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class FetherContextWindowMenu {
  constructor (fetherApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Fether context window menu more than once'
      );
    }

    this.setMenuTemplate(getContextWindowMenuTemplate(fetherApp));
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

export default FetherContextWindowMenu;
