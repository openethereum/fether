// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('createAccountStore')
@observer
class AccountCopyPhrase extends Component {
  render () {
    const {
      createAccountStore: { address, name, bip39Phrase },
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <AccountCard
        address={address}
        name={name}
        drawers={[
          <div key='createAccount'>
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
                <button className='button -cancel' onClick={history.goBack}>
                  Back
                </button>
              )}
              <Link to={`/accounts/new/${+currentStep + 1}`}>
                <button className='button'>Next</button>
              </Link>
            </nav>
          </div>
        ]}
      />
    );
  }
}

export default AccountCopyPhrase;
