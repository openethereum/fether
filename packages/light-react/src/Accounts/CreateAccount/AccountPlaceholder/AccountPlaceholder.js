// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

class AccountPlaceholder extends Component {
  render () {
    return (
      <div className='account -placeholder'>
        <div className='account_avatar'>
          <div className='account_avatar_placeholder' />
        </div>
        <div className='account_information'>
          <div className='account_name'>
            <div className='account_name_placeholder' />
          </div>
          <div className='account_address'>
            <div className='account_address_placeholder' />
          </div>
        </div>
      </div>
    );
  }
}

export default AccountPlaceholder;
