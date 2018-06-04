// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import Blockie from 'react-blockies';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class CreateAccountHeader extends Component {
  render () {
    const { createAccountStore: { address, name } } = this.props;

    return (
      <div className='account'>
        <div className='account_avatar'>
          <Blockie seed={address} />
        </div>
        <div className='account_information'>
          <div className='account_name'>
            {name || <span className='span -placeholder'>Account</span>}
          </div>
          <div className='account_address'>
            {address}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountHeader;
