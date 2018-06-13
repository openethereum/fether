// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { FormField } from 'light-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import CreateAccountContainer from '../CreateAccountContainer';

@inject('createAccountStore')
@observer
class AccountName extends Component {
  componentDidMount () {
    const { createAccountStore } = this.props;
    // Generate a new public address if there's none yet
    if (!createAccountStore.address) {
      createAccountStore.generateNewAccount();
    }
  }

  handleChangeName = ({ target: { value } }) =>
    this.props.createAccountStore.setName(value);

  render () {
    const {
      createAccountStore: { generateNewAccount, isImport, name },
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <CreateAccountContainer>
        {!isImport && (
          <div className='box -pull-up text -right'>
            <button
              onClick={generateNewAccount}
              className='button -tiny -reload'
            >
              Regenerate address
            </button>
          </div>
        )}
        <div className='text'>
          <p>Please give this account a name:</p>
        </div>
        <FormField
          label='Name'
          onChange={this.handleChangeName}
          required
          type='text'
          value={name}
        />
        <nav className='form-nav'>
          {name ? (
            <Link to={`/accounts/new/${+currentStep + 1}`}>
              <button className='button'>Next</button>
            </Link>
          ) : (
            <button className='button' disabled>
              Next
            </button>
          )}
        </nav>
      </CreateAccountContainer>
    );
  }
}

export default AccountName;
