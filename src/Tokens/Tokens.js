// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import Balance from './Balance';

class Accounts extends Component {
  render () {
    return (
      <div>
        <ul className='list -tokens'>
          <li>
            <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
          </li>
          <li>
            <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
          </li>
          <li>
            <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
          </li>
          <li>
            <Balance address='0x00Ae02834e91810B223E54ce3f9B7875258a1747' />
          </li>
        </ul>
      </div>
    );
  }
}

export default Accounts;
