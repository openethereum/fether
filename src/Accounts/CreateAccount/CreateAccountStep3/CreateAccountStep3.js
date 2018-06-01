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
class CreateAccountStep3 extends Component {
  state = {
    value: ''
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  render () {
    const { createAccountStore: { address, name, phrase } } = this.props;
    const { value } = this.state;

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
                <p>Please write your recovery phrase here:</p>
              </div>
              <div className='form_field'>
                <label>Recovery phrase</label>
                <input onChange={this.handleChange} required value={value} />
              </div>

              <nav className='form-nav'>
                {value === phrase
                  ? <Link to='/accounts/new/4'>
                    <button className='button'>Next</button>
                  </Link>
                  : <button className='button' disabled>
                      Next
                  </button>}
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountStep3;
