// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import Blockie from 'react-blockies';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('createAccountStore')
@observer
class CreateAccountStep1 extends Component {
  componentDidMount () {
    this.props.createAccountStore.generateNewAccount();
  }

  handleChange = ({ target: { value } }) =>
    this.props.createAccountStore.setName(value);

  render () {
    const {
      createAccountStore: { address, generateNewAccount, name },
      location: { pathname }
    } = this.props;

    return (
      <div className='window_content -modal'>
        {address &&
          <div className='box -padded'>
            <div className='account box -card'>
              <div className='account_avatar'>
                <Blockie seed={address} />
              </div>
              <div className='account_information'>
                <div className='account_name'>
                  {name
                  ? name
                  : <span className='span -placeholder'>Account name</span>}
                </div>
                <div className='account_address'>
                  {address}
                </div>
              </div>
            </div>
            <div className='box'>
              {pathname === '/accounts/new' &&
                <button onClick={generateNewAccount} className='button -tiny -reload'>Regenerate address</button>}
            </div>
            <label>Name</label>
            <input
              disabled={pathname !== '/accounts/new'}
              onChange={this.handleChange}
              required
              value={name}
            />
            <nav className='box'>
              {pathname === '/accounts/new' &&
                !!name &&
                <Link to='/accounts/new/step2'>
                  <button>Next</button>
                </Link>}
            </nav>
          </div>}
      </div>
    );
  }
}

export default CreateAccountStep1;
