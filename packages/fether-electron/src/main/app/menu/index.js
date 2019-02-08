// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import { getTemplate } from './template';

const { Menu } = electron;

const getMenu = () => {
  return Menu.getApplicationMenu();
};

const addMenu = fetherApp => {
  const menu = Menu.buildFromTemplate(getTemplate(fetherApp));
  Menu.setApplicationMenu(menu);
};

export { addMenu, getMenu };
