// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import Accounts from '../Accounts';

class Settings extends Component {
  render () {
    return (
      <div>
        <h3>This is the settings page.</h3>
        <Accounts />
      </div>
    );
  }
}

export default Settings;
