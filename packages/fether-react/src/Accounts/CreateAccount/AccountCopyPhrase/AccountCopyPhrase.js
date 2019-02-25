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
  state = {
    error: null
  };

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
      history.push(`/accounts/new/${+currentStep + 1}`);
    } else {
      history.push(`/accounts/new/${+currentStep + 2}`);
    }
  };

  onCopyPhrase = event => {
    // Disable copying the phrase if in production.
    // Keep it enabled for development.
    if (process.env.NODE_ENV === 'production') {
      event.preventDefault();
      this.setState({
        error:
          'Copy and pasting is disabled for this step. Please type out your full recovery phrase.'
      });

      return false;
    }
  };

  render () {
    const {
      createAccountStore: { address, name, bip39Phrase }
    } = this.props;
    const { error } = this.state;

    return (
      <RequireHealthOverlay require='node'>
        <AccountCard
          address={address}
          name={name}
          drawers={[
            <form key='createAccount' onSubmit={this.handleSubmit}>
              <div className='text'>
                <p>Write down your recovery phrase.</p>
              </div>
              <div className='text -code' onCopy={this.onCopyPhrase}>
                {bip39Phrase}
              </div>
              <div className='text -space-around'>
                <b>IMPORTANT</b>
                <div className='text -tiny'>
                  <ul className='-bulleted'>
                    <li>
                      <b>
                        If someone gets hold of your recovery phrase, they will
                        be able to drain your account.
                      </b>
                    </li>
                    <li>Write it on a piece of paper and store securely.</li>
                  </ul>
                </div>
              </div>

              {error}

              <nav className='form-nav -space-around'>
                <button
                  className='button -back'
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
