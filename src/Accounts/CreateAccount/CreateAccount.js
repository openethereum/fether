// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import memoize from 'lodash/memoize';

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

  render () {
    const {
      createAccountStore: { isImport },
      match: { params: { step } } // Current step
    } = this.props;

    // Get all the steps of our account process
    const Steps = this.getSteps(isImport);

    return (
      <div>
        <nav className='header-nav -modal'>
          <div className='header-nav_left'>
            <Link to='/accounts' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>
              {isImport ? 'Import account' : 'Create a new account'}
            </h1>
          </div>
          <div className='header-nav_right'>
            <div className='progress-indicator'>
              {Steps.map((_, index) =>
                <div
                  className={[
                    'progress-indicator_step',
                    step > index ? '-complete' : ''
                  ].join(' ')}
                  key={`progress-indicator_step${index + 1}`}
                />
              )}
            </div>
          </div>
        </nav>

        <div className='window_content -modal'>
          {Steps.map((StepComponent, index) =>
            <Route
              component={StepComponent}
              key={`Step${index + 1}`}
              path={`/accounts/new/${index + 1}`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CreateAccount;
