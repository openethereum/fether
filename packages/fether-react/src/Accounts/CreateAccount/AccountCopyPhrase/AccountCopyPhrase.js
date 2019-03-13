// Copyright 2015-2019 Parity Technologies (UK) Ltd.
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
                <p>Please write your secret phrase on a piece of paper:</p>
              </div>
              <div className='text -code'>{bip39Phrase}</div>
              <div className='text'>
                <div className='text -tiny'>
                  Keep it secure and secret.
                  <ul className='-bulleted'>
                    <li>
                      If you lose your secret phrase, your wallet cannot be
                      recovered.
                    </li>
                    <li>
                      If someone gets hold of your secret phrase, they will be
                      able to drain your account.
                    </li>
                  </ul>
                </div>
              </div>
              <nav className='form-nav -space-around'>
                {currentStep > 1 && (
                  <button
                    className='button -back'
                    onClick={history.goBack}
                    type='button'
                  >
                    Back
                  </button>
                )}
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
