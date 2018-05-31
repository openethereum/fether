// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import Blockie from 'react-blockies';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class CreateAccountStep5 extends Component {
  handleSubmit = () => {
    const { createAccountStore: { saveAccountToParity }, history } = this.props;
    saveAccountToParity().then(() => history.push('/accounts'));
  };

  render () {
    const { createAccountStore: {  address, name, hint } } = this.props;

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
                  {name
                  ? name
                  : <span className='span -placeholder'>Account</span>}
                </div>
                <div className='account_address'>
                  {address}
                </div>
              </div>
            </div>
            <div className='box -card-drawer'>
              <div className='text'>
                <p>Ready to create account?</p>
              </div>
              <div className='text -code'>
                {hint}
              </div>
              <nav className='form-nav'>
                <button onClick={this.handleSubmit} className='button'>Next</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountStep5;
