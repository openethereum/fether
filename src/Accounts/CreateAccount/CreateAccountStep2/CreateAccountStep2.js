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
class CreateAccountStep2 extends Component {
  render () {
    const { createAccountStore: { address, name, phrase } } = this.props;

    return (
      <div className='window_content'>
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
              <div className='text'>
                <p>Please write your secret phrase on a piece of paper:</p>
              </div>
              <div className='text -code'>
                {phrase}
              </div>
              <nav className='form-nav'>
                <Link to='/accounts/new/3'>
                  <button className='button'>Next</button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountStep2;
