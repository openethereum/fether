// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause
import { AccountCard, Header, Form as FetherForm } from 'fether-ui';
import localForage from 'localforage';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RequireHealthOverlay from '../RequireHealthOverlay';
import withAccount from '../utils/withAccount';
import Health from '../Health';

@withAccount
class FlaggedPhraseRewrite extends Component {
  state = {
    error: null,
    phrase: null,
    value: ''
  };

  componentDidMount () {
    this.getPhrase();
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handleSubmit = async () => {
    const {
      account: { address },
      history
    } = this.props;

    // unset account flag
    await localForage.removeItem(`__flagged_${address}`);
    // go to account
    history.push(`/tokens/${address}`);
  };

  getPhrase = async () => {
    const phrase = await localForage.getItem(
      `__flagged_${this.props.account.address}`
    );

    this.setState({ phrase });
  };

  onCopyOrPastePhrase = event => {
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
      account: { address, name },
      history
    } = this.props;
    const { error, phrase, value } = this.state;

    return (
      <RequireHealthOverlay require='sync'>
        <div>
          <Header
            left={
              <Link
                to='/tokens'
                className='icon -back'
                onClick={history.goBack}
              >
                Close
              </Link>
            }
            title={<h1>Account Recovery Phrase</h1>}
          />

          <AccountCard
            address={address}
            name={address && !name ? '(no name)' : name}
          />

          <div className='text -code' onCopy={this.onCopyOrPastePhrase}>
            {phrase}
          </div>

          <form key='rewritePhrase' onSubmit={this.handleSubmit}>
            <FetherForm.Field
              autoFocus
              as='textarea'
              label='Recovery phrase'
              onChange={this.handleChange}
              onPaste={this.onCopyOrPastePhrase}
              required
              value={value}
            />

            <nav className='form-nav -space-around'>
              <button
                className='button -back'
                onClick={history.goBack}
                type='button'
              >
                Back
              </button>
              <button className='button' disabled={value !== phrase}>
                Next
              </button>
            </nav>
          </form>

          {error}

          <nav className='footer-nav'>
            <div className='footer-nav_status'>
              <Health />
            </div>
          </nav>
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default FlaggedPhraseRewrite;
