// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import Balance from './Balance';

class Accounts extends Component {
  render () {
    return (
      <ul className="list -tokens">
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
        <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
      </ul>
    );
  }
}

export default Accounts;
