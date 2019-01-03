// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Card, Form as FetherForm } from 'fether-ui';
import Blockies from 'react-blockies';
import { inject, observer } from 'mobx-react';

import loading from '../../../assets/img/icons/loading.svg';

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

  handleSubmit = () => {
    const {
      history,
      location: { pathname }
    } = this.props;

    const currentStep = pathname.slice(-1);

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

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
            {address ? (
              <Blockies seed={address.toLowerCase()} />
            ) : (
              <img
                className='account_avatar_loading'
                alt='loading'
                src={loading}
              />
            )}
          </div>
          <div className='account_change_blockies'>
            <button className='button -cancel' onClick={generateNewAccount}>
              Generate another icon
            </button>
          </div>
        </div>
      </Card>
    );
  };

  renderDrawer = () => {
    const {
      createAccountStore: { address, name },
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <form key='createAccount' onSubmit={this.handleSubmit}>
        <div className='text'>
          <p>Please give this account a name:</p>
        </div>
        <FetherForm.Field
          autoFocus
          label='Name'
          onChange={this.handleChangeName}
          required
          type='text'
          value={name}
        />
        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button
              className='button -cancel'
              onClick={history.goBack}
              type='button'
            >
              Back
            </button>
          )}
          {name && address ? (
            <button className='button'>Next</button>
          ) : (
            <button className='button' disabled>
              Next
            </button>
          )}
        </nav>
      </form>
    );
  };
}

export default AccountName;
