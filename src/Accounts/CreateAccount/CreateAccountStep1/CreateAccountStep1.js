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
      match: { pathname }
    } = this.props;

    return (
      <div className='window_content'>
        {address &&
          <div className='box -padded'>
            <div className='box -card'>
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
              <div className='box -card-drawer'>
                <div className='box -pull-up text -right'>
                  {pathname === '/accounts/new/1' &&
                    <button
                      onClick={generateNewAccount}
                      className='button -tiny -reload'
                    >
                      Regenerate address
                    </button>}
                </div>
                <div className='form_field'>
                  <label>Name</label>
                  <input
                    onChange={this.handleChange}
                    required
                    placeholder='Enter a name for this account'
                    value={name}
                  />
                </div>
                <nav className='form-nav'>
                  {name
                    ? <Link to='/accounts/new/2'>
                      <button className='button'>Next</button>
                    </Link>
                    : <button className='button' disabled>
                        Next
                    </button>}
                </nav>
              </div>
            </div>
          </div>}
      </div>
    );
  }
}

export default CreateAccountStep1;
