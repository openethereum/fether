// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import CreateAccountHeader from '../CreateAccountHeader';

@inject('createAccountStore')
@observer
class AccountConfirm extends Component {
  handleSubmit = () => {
    const { createAccountStore: { saveAccountToParity }, history } = this.props;
    saveAccountToParity().then(() => history.push('/accounts'));
  };

  render () {
    const { createAccountStore: { hint } } = this.props;

    return (
      <div className='box -padded'>
        <div className='box -card'>
          <CreateAccountHeader />
          <div className='box -card-drawer'>
            <div className='text'>
              <p>Ready to create account?</p>
            </div>
            <nav className='form-nav'>
              <button onClick={this.handleSubmit} className='button'>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountConfirm;
