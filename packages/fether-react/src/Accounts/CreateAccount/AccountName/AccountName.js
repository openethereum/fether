// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Card, Form as FetherForm } from 'fether-ui';
import Blockies from 'react-blockies';
import { inject, observer } from 'mobx-react';

import i18n from '../../../i18n';
import RequireHealthOverlay from '../../../RequireHealthOverlay';
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
      createAccountStore,
      history,
      location: { pathname }
    } = this.props;

    const currentStep = pathname.slice(-1);

    if (createAccountStore.noPrivateKey) {
      // Save Signer account to Parity without asking for a password
      createAccountStore
        .saveAccountToParity()
        .then(res => {
          createAccountStore.clear();
          history.push('/accounts');
        })
        .catch(err => {
          console.error(err);

          this.setState({
            error: err.text
          });
        });
    } else {
      // Ask for a password otherwise
      history.push(`/accounts/new/${+currentStep + 1}`);
    }
  };

  render () {
    const {
      createAccountStore: { isImport }
    } = this.props;

    return (
      <RequireHealthOverlay require='node'>
        {isImport ? this.renderCardWhenImported() : this.renderCardWhenNew()}
      </RequireHealthOverlay>
    );
  }

  renderCardWhenImported = () => {
    const {
      createAccountStore: { address, name, noPrivateKey }
    } = this.props;

    return (
      <AccountCard
        address={address}
        type={noPrivateKey ? 'signer' : 'node'}
        drawers={[this.renderDrawer()]}
        name={name || i18n.t('ns1:account.existing.no_name')}
        i18n={i18n}
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
            <button className='button -back' onClick={generateNewAccount}>
              {i18n.t('ns1:account.create.change_icon')}
            </button>
          </div>
        </div>
      </Card>
    );
  };

  renderDrawer = () => {
    const {
      createAccountStore: { address, name },
      error,
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <form key='createAccount' noValidate onSubmit={this.handleSubmit}>
        <div className='text'>
          <p>{i18n.t('ns1:account.create.label_name_msg')}</p>
        </div>
        <FetherForm.Field
          autoFocus
          label={i18n.t('ns1:account.create.label_name')}
          onChange={this.handleChangeName}
          required
          type='text'
          value={name}
        />
        {error && <p>{error}</p>}
        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button
              className='button -back'
              onClick={history.goBack}
              type='button'
            >
              {i18n.t('ns1:navigation.back')}
            </button>
          )}
          {name && address ? (
            <button className='button'>{i18n.t('ns1:navigation.next')}</button>
          ) : (
            <button className='button' disabled>
              {i18n.t('ns1:navigation.next')}
            </button>
          )}
        </nav>
      </form>
    );
  };
}

export default AccountName;
