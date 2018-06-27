// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Card, FormField } from 'fether-ui';
import Blockies from 'react-blockies';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

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
      createAccountStore: { isImport }
    } = this.props;

    return isImport ? this.renderCardWhenImported() : this.renderCardWhenNew();
  }

  renderCardWhenImported = () => {
    const {
      createAccountStore: { address, name }
    } = this.props;

    return (
      <AccountCard
        address={address}
        drawers={[this.renderDrawer()]}
        name={name || '(no name)'}
      />
    );
  };

  renderCardWhenNew = () => {
    const {
      createAccountStore: { address, generateNewAccount }
    } = this.props;

    return (
      <Card drawers={[this.renderDrawer()]}>
        <div className='account'>
          <div className='account_avatar'>
            {!!address && <Blockies seed={address.toLowerCase()} />}
          </div>
          <div className='account_information'>
            <button className='button' onClick={generateNewAccount}>
              Choose another icon
            </button>
          </div>
        </div>
      </Card>
    );
  };

  renderDrawer = () => {
    const {
      createAccountStore: { name },
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <div key='createAccount'>
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
      </div>
    );
  };
}

export default AccountName;
