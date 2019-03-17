// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';

import AccountCopyPhrase from './AccountCopyPhrase';
import AccountImportOptions from './AccountImportOptions';
import AccountRewritePhrase from './AccountRewritePhrase';
import AccountName from './AccountName';
import AccountPassword from './AccountPassword';
import Health from '../../Health';
import i18n from '../../i18n';
import withAccountsInfo from '../../utils/withAccountsInfo';

@inject('createAccountStore')
@withAccountsInfo
@observer
class CreateAccount extends Component {
  constructor (props) {
    super(props);
    props.createAccountStore.clear();
  }

  /**
   * Creating account and importing accounts have different processes: 4 steps
   * for importing, and 5 steps for creating
   */
  getSteps = isImport =>
    isImport
      ? [AccountImportOptions, AccountName, AccountPassword]
      : [AccountName, AccountCopyPhrase, AccountRewritePhrase, AccountPassword];

  handleToggleCreateImport = () => {
    const {
      createAccountStore,
      history,
      match: {
        params: { step }
      }
    } = this.props;
    createAccountStore.clear();
    createAccountStore.setIsImport(!createAccountStore.isImport);
    // If we were further in the account creation, go back to step 1
    if (step > 1) {
      history.push('/accounts/new/1');
    }
  };

  render () {
    const {
      accountsInfo,
      createAccountStore: { isImport },
      match: {
        params: { step }
      }
    } = this.props;

    // Get all the steps of our account process
    const Steps = this.getSteps(isImport);

    return (
      <React.Fragment>
        <Header
          left={
            // Show back button if we already have some accounts, so we can go back to AccountsList
            accountsInfo &&
            Object.keys(accountsInfo).length > 0 && (
              <Link className='icon -back' to='/accounts'>
                Back
              </Link>
            )
          }
          title={
            <h1>
              {isImport
                ? i18n.t('ns1:account.import.title')
                : i18n.t('ns1:account.create.title')}
            </h1>
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
          {step > 1 ? (
            <div className='footer-nav_status'>
              <Health />
            </div>
          ) : (
            <div className='footer-nav_option'>
              {isImport ? null : (
                <p>
                  {i18n.t('ns1:account.import.question')}
                  <button
                    className='button -footer'
                    onClick={this.handleToggleCreateImport}
                  >
                    {i18n.t('ns1:account.import.title')}
                  </button>
                </p>
              )}
            </div>
          )}
        </nav>
      </React.Fragment>
    );
  }
}

export default CreateAccount;
