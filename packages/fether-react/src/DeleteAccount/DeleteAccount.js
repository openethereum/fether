// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountHeader, Card, Form as FetherForm } from 'fether-ui';
import localForage from 'localforage';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import i18n, { packageNS } from '../i18n';
import localForage$ from '../utils/localForage';
import { SIGNER_ACCOUNTS_LS_KEY } from '../stores/createAccountStore';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
@inject('parityStore')
@observer
class DeleteAccount extends Component {
  state = {
    isLoading: false,
    password: '',
    message: ''
  };

  deleteParityAccount = event => {
    const {
      account: { address },
      parityStore: { api },
      history
    } = this.props;
    const { password } = this.state;

    event && event.preventDefault();

    this.setState({ isLoading: true });

    api.parity
      .killAccount(address, password)
      .then(() => {
        history.push(`/accounts`);
      })
      .catch(err => {
        this.setState({
          message: err.text + ' Please check your password and try again.'
        });
        this.setState({ isLoading: false });
      });
  };

  deleteSignerAccount = () => {
    const {
      account: { address: currentAddress },
      history
    } = this.props;

    localForage$(SIGNER_ACCOUNTS_LS_KEY).subscribe(async accounts => {
      const removed = accounts.filter(
        ({ address }) => address !== currentAddress
      );

      await localForage.setItem(SIGNER_ACCOUNTS_LS_KEY, removed);

      history.push(`/accounts`);
    });
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  render () {
    const {
      account: { name, address, type }
    } = this.props;

    return (
      <div>
        <AccountHeader
          address={address}
          copyAddress
          i18n={i18n}
          name={name}
          packageNS={packageNS}
          type={type}
          left={
            <Link to='/accounts' className='icon -back'>
              {i18n.t(`${packageNS}:navigation.back`)}
            </Link>
          }
        />
        <br />
        <Card className='-space-around'>
          {type === 'signer'
            ? this.renderSignerAccount()
            : this.renderParityAccount()}
        </Card>
      </div>
    );
  }

  renderParityAccount () {
    const { history } = this.props;
    const { isLoading, message, password } = this.state;

    return (
      <form onSubmit={this.deleteParityAccount}>
        <div className='text'>
          <p>{i18n.t(`${packageNS}:account.delete.warning_parity_account`)}</p>
        </div>
        <br />

        <div className='text'>
          <p>
            {i18n.t(`${packageNS}:account.delete.label_msg_password_unlock`)}
          </p>
        </div>

        <FetherForm.Field
          label={i18n.t(`${packageNS}:account.delete.label_password_unlock`)}
          onChange={this.handlePasswordChange}
          autoFocus
          required
          type='password'
          value={password}
        />

        <p className='error'> {message} </p>

        <nav className='form-nav -space-around'>
          <button
            className='button -back'
            onClick={history.goBack}
            type='button'
          >
            {i18n.t(`${packageNS}:navigation.back`)}
          </button>
          <button
            autoFocus
            className='button'
            disabled={!password || isLoading}
          >
            {i18n.t(`${packageNS}:account.delete.button_confirm`)}
          </button>
        </nav>
      </form>
    );
  }

  renderSignerAccount () {
    const { history } = this.props;

    return (
      <React.Fragment>
        <div className='text'>
          <p>{i18n.t(`${packageNS}:account.delete.warning_signer_account`)}</p>
        </div>

        <br />

        <nav className='form-nav -space-around'>
          <button
            className='button -back'
            onClick={history.goBack}
            type='button'
          >
            {i18n.t(`${packageNS}:navigation.back`)}
          </button>
          <button
            autoFocus
            className='button'
            onClick={this.deleteSignerAccount}
          >
            {i18n.t(`${packageNS}:account.delete.button_confirm`)}
          </button>
        </nav>
      </React.Fragment>
    );
  }
}

export default DeleteAccount;
