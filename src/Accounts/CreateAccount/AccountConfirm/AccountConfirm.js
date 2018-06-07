// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import CreateAccountHeader from '../CreateAccountHeader';

@inject('createAccountStore', 'firstRunStore')
@observer
class AccountConfirm extends Component {
  handleSubmit = () => {
    const {
      createAccountStore: { saveAccountToParity },
      history,
      firstRunStore
    } = this.props;

    // If we were onboarding, set isFirstRun to false, so that we quit
    // onboarding.
    if (firstRunStore.isFirstRun) {
      firstRunStore.setIsFirstRun(false);
    }

    saveAccountToParity().then(() => history.push('/accounts'));
  };

  render () {
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
                Confirm
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountConfirm;
