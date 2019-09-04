// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';

import i18n, { packageNS } from '../../../i18n';

@inject('createAccountStore')
@observer
class AccountPassword extends Component {
  state = {
    confirm: '',
    error: '',
    passwordMatchCriteria: true,
    isLoading: false,
    password: ''
  };

  handleConfirmChange = ({ target: { value } }) => {
    this.setState({ confirm: value });
  };

  handlePasswordChange = ({ target: { value } }) => {
    // at leat 8 characters, at least one of them being a number
    const PASSWORD_CRITERIA = /^(?=.*\d).{8,}$/;
    const regex = new RegExp(PASSWORD_CRITERIA);
    const passwordMatchCriteria = regex.test(value);

    this.setState({ password: value, passwordMatchCriteria });
  };

  handleSubmit = event => {
    const { createAccountStore, history } = this.props;
    const { confirm, password } = this.state;

    event.preventDefault();

    if (!createAccountStore.jsonString && confirm !== password) {
      this.setState({
        error: `${i18n.t(
          `${packageNS}:account.password.create.error_msg_password_confirmation_no_match`
        )}`
      });
      return;
    }

    this.setState({ isLoading: true });

    // Save to parity
    createAccountStore
      .saveAccountToParity(password)
      .then(res => {
        createAccountStore.clear();
        history.push('/accounts');
      })
      .catch(err => {
        console.error(err);

        this.setState({
          isLoading: false,
          error: err.text
        });
      });
  };

  render () {
    const {
      createAccountStore: { address, name, jsonString, isImport },
      history,
      location: { pathname }
    } = this.props;
    const {
      confirm,
      error,
      isLoading,
      password,
      passwordMatchCriteria
    } = this.state;
    const currentStep = pathname.slice(-1);

    return (
      <AccountCard
        address={address}
        name={name}
        drawers={[
          <form key='createAccount' noValidate onSubmit={this.handleSubmit}>
            <div className='text'>
              <p>
                {' '}
                {jsonString
                  ? i18n.t(
                    `${packageNS}:account.password.import.label_msg_unlock_json`
                  )
                  : i18n.t(
                    `${packageNS}:account.password.create.label_msg_password`
                  )}
              </p>
            </div>

            <FetherForm.Field
              autoFocus
              label={i18n.t(
                `${packageNS}:account.password.common.label_password`
              )}
              onChange={this.handlePasswordChange}
              required
              type='password'
              value={password}
            />

            {!jsonString && (
              <>
                {!passwordMatchCriteria && (
                  <p>
                    {i18n.t(
                      `${packageNS}:account.password.common.error_msg_password_insecure`
                    )}
                  </p>
                )}

                <FetherForm.Field
                  label={i18n.t(
                    `${packageNS}:account.password.common.label_password_confirm`
                  )}
                  onChange={this.handleConfirmChange}
                  required
                  type='password'
                  value={confirm}
                />
              </>
            )}

            <p>
              {error &&
                error +
                  ' ' +
                  i18n.t(
                    `${packageNS}:account.password.common.error_msg_password_incorrect`
                  )}
            </p>

            <nav className='form-nav -space-around'>
              {currentStep > 1 && (
                <button
                  className='button -back'
                  onClick={history.goBack}
                  type='button'
                >
                  {i18n.t(`${packageNS}:navigation.back`)}
                </button>
              )}
              <button
                autoFocus
                className='button'
                disabled={
                  !password ||
                  (!jsonString && confirm !== password) ||
                  isLoading ||
                  !passwordMatchCriteria
                }
              >
                {i18n.t(`${packageNS}:account.password.common.button_confirm`, {
                  postfix: isImport
                    ? i18n.t(
                      `${packageNS}:account.password.common.button_confirm_opt1`
                    )
                    : i18n.t(
                      `${packageNS}:account.password.common.button_confirm_opt2`
                    )
                })}
              </button>
            </nav>
          </form>
        ]}
        i18n={i18n}
        packageNS={packageNS}
      />
    );
  }
}

export default AccountPassword;
