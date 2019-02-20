// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard } from 'fether-ui';
import { inject, observer } from 'mobx-react';

import RequireHealthOverlay from '../../../RequireHealthOverlay';

@inject('createAccountStore')
@observer
class AccountCopyPhrase extends Component {
  handleSubmit = async event => {
    const {
      createAccountStore: { flagAccount },
      history,
      location: { pathname }
    } = this.props;

    const currentStep = pathname.slice(-1);

    // If user wants to skip, move directly past the rewrite step.
    if (event.currentTarget.dataset.skip) {
      await flagAccount();
      history.push(`/accounts/new/${+currentStep + 2}`);
    } else {
      history.push(`/accounts/new/${+currentStep + 1}`);
    }
  };

  render () {
    const {
      createAccountStore: { address, name, bip39Phrase },
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <RequireHealthOverlay require='node'>
        <AccountCard
          address={address}
          name={name}
          drawers={[
            <form key='createAccount' onSubmit={this.handleSubmit}>
              <div className='text'>
                <p>Please write your recovery phrase on a piece of paper:</p>
              </div>
              <div className='text -code'>{bip39Phrase}</div>
              <div className='text'>
                <div className='text -tiny'>
                  Keep it secure and secret.
                  <ul className='-bulleted'>
                    <li>
                      {' '}
                      If you skip this step you can view your phrase to copy it
                      to somewhere safe later on{' '}
                      <b> only if you remember your password! </b>{' '}
                    </li>
                    <li>
                      <b>
                        If you lose your recovery phrase, your wallet cannot be
                        recovered
                      </b>{' '}
                      unless you choose to backup your account to a password
                      encrypted JSON file. You must remember this password!
                    </li>
                    <li>
                      If someone gets hold of your recovery phrase, they will be
                      able to drain your account.
                    </li>
                    <li>
                      {' '}
                      If you do confirm your recovery phrase on the next screen,
                      you MUST make sure it is somewhere safe & accessible. You
                      will not be able to view it again.{' '}
                    </li>
                  </ul>
                </div>
              </div>
              <nav className='form-nav -space-around'>
                <button
                  className='button -skip'
                  data-skip
                  onClick={this.handleSubmit}
                >
                  Skip
                </button>

                <button autoFocus className='button'>
                  Next
                </button>
              </nav>
            </form>
          ]}
        />
      </RequireHealthOverlay>
    );
  }
}

export default AccountCopyPhrase;
