// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { accountsInfo$ } from '@parity/light.js';
import { Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';
import memoize from 'lodash/memoize';
import { Route } from 'react-router-dom';

import AccountConfirm from './AccountConfirm';
import AccountCopyPhrase from './AccountCopyPhrase';
import AccountName from './AccountName';
import AccountPassword from './AccountPassword';
import AccountWritePhrase from './AccountWritePhrase';

@light({ accountsInfo: accountsInfo$ })
@inject('createAccountStore')
@observer
class CreateAccount extends Component {
  /**
   * Creating account and importing accounts have different processes: 4 steps
   * for importing, and 5 steps for creating
   */
  getSteps = memoize(isImport => {
    return isImport
      ? [AccountWritePhrase, AccountName, AccountPassword, AccountConfirm]
      : [
        AccountName,
        AccountCopyPhrase,
        AccountWritePhrase,
        AccountPassword,
        AccountConfirm
      ];
  });

  handleToggleCreateImport = () => {
    const {
      createAccountStore,
      history,
      match: {
        params: { step }
      }
    } = this.props;
    createAccountStore.setIsImport(!createAccountStore.isImport);

    // If we were further in the account creation, go back to step 1
    if (step > 1) {
      history.push('/accounts/new/1');
    }
  };

  handleGoBack = () => this.props.history.goBack();

  render () {
    const {
      accountsInfo,
      createAccountStore: { isImport },
      match: {
        params: { step } // Current step in account creation process
      }
    } = this.props;

    // Get all the steps of our account process
    const Steps = this.getSteps(isImport);

    return (
      <div>
        <Header
          left={
            // Show back button if:
            // - we already have some accounts, so we can go back to AccountsList
            // - or the step is >1
            (step > 1 ||
              (accountsInfo && Object.keys(accountsInfo).length > 0)) && (
              <a className='icon -back' onClick={this.handleGoBack}>
                Back
              </a>
            )
          }
          title={
            <h1>{isImport ? 'Import account' : 'Create a new account'}</h1>
          }
        />

        <div className='window_content'>
          <div className='box -padded'>
            {Steps.map((StepComponent, index) => (
              <Route
                component={StepComponent}
                key={`Step${index + 1}`}
                path={`/accounts/new/${index + 1}`}
              />
            ))}
          </div>
        </div>

        <nav className='footer-nav'>
          <div className='footer-nav_option'>
            {isImport ? (
              <p>
                Need to create an account?
                <button
                  className='button -footer'
                  onClick={this.handleToggleCreateImport}
                >
                  New account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button
                  className='button -footer'
                  onClick={this.handleToggleCreateImport}
                >
                  Import account
                </button>
              </p>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

export default CreateAccount;
