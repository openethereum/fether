// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Header } from 'light-ui';
import { inject, observer } from 'mobx-react';
import memoize from 'lodash/memoize';
import { Route } from 'react-router-dom';

import AccountConfirm from './AccountConfirm';
import AccountCopyPhrase from './AccountCopyPhrase';
import AccountName from './AccountName';
import AccountPassword from './AccountPassword';
import AccountWritePhrase from './AccountWritePhrase';

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
            <a className='icon -back' onClick={this.handleGoBack}>
              Back
            </a>
          }
          title={
            <h1>{isImport ? 'Import account' : 'Create a new account'}</h1>
          }
          right={
            <div className='progress-indicator'>
              {Steps.map((_, index) => (
                <div
                  className={[
                    'progress-indicator_step',
                    step > index ? '-complete' : ''
                  ].join(' ')}
                  key={`progress-indicator_step${index + 1}`}
                />
              ))}
            </div>
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
