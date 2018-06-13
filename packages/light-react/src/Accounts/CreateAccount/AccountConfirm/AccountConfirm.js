// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import CreateAccountContainer from '../CreateAccountContainer';

@inject('createAccountStore', 'onboardingStore')
@observer
class AccountConfirm extends Component {
  handleSubmit = () => {
    const { createAccountStore, history, onboardingStore } = this.props;

    // If we were onboarding, set isFirstRun to false, so that we quit
    // onboarding.
    if (onboardingStore.isFirstRun) {
      onboardingStore.setIsFirstRun(false);
    }

    createAccountStore.saveAccountToParity().then(() => {
      createAccountStore.clear();
      history.push('/accounts');
    });
  };

  render () {
    return (
      <CreateAccountContainer>
        <div className='text'>
          <p>Ready to create account?</p>
        </div>
        <nav className='form-nav'>
          <button onClick={this.handleSubmit} className='button'>
            Confirm
          </button>
        </nav>
      </CreateAccountContainer>
    );
  }
}

export default AccountConfirm;
