// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause
import { AccountCard, Header, Form as FetherForm } from 'fether-ui';
import localForage from 'localforage';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';

import RequireHealthOverlay from '../RequireHealthOverlay';
import withAccount from '../utils/withAccount';
import Health from '../Health';

@inject('parityStore')
@withAccount
class FlaggedPhraseRewrite extends Component {
  state = {
    error: null,
    password: '',
    phrase: '',
    phraseRewrite: '',
    unlocked: true
  };

  componentDidMount () {
    this.getPhrase();
  }

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  // handle the user typed phrase rewrite
  handleChangePhrase = ({ target: { value } }) => {
    this.setState({ phraseRewrite: value });
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

  // Get the actual phrase to rewrite
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

  unlockWithPassword = async () => {
    const {
      account: { address },
      parityStore: { api }
    } = this.props;

    const { password } = this.state;

    try {
      await api.parity.testPassword(address, password);

      this.setState({
        unlocked: true
      });
    } catch (e) {
      console.log(e);
    }
  };

  render () {
    const {
      account: { address, name },
      history
    } = this.props;
    const { error, unlocked } = this.state;

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

          {unlocked ? this.renderRewriteForm() : this.renderPasswordForm()}
          {error}
          {this.renderTips()}

          <nav className='footer-nav'>
            <div className='footer-nav_status'>
              <Health />
            </div>
          </nav>
        </div>
      </RequireHealthOverlay>
    );
  }

  renderPasswordForm () {
    const { history } = this.props;
    const { password } = this.state;

    return (
      <div>
        <div className='text -centered -space-around'>
          Unlock your account to view your phrase then rewrite your it below to
          confirm you have backed it up somewhere safe.
        </div>
        <form key='password' onSubmit={this.unlockWithPassword}>
          <FetherForm.Field
            autoFocus
            label='Password'
            onChange={this.handleChangePassword}
            required
            type='password'
            value={password}
          />
          <nav className='form-nav -space-around'>
            <button
              className='button -back'
              onClick={history.goBack}
              type='button'
            >
              Back
            </button>
            <button className='button' disabled={!password || !password.length}>
              Unlock
            </button>
          </nav>
        </form>
      </div>
    );
  }

  renderRewriteForm () {
    const { history } = this.props;
    const { phrase, phraseRewrite } = this.state;

    return (
      <div>
        <div className='text -centered -space-around'>
          Rewrite your phrase below to confirm you have backed it up somewhere
          safe.
        </div>
        <div
          className='text -code -space-around'
          onCopy={this.onCopyOrPastePhrase}
        >
          {phrase}
        </div>
        <form key='rewritePhrase' onSubmit={this.handleSubmit}>
          <FetherForm.Field
            autoFocus
            as='textarea'
            label='Recovery phrase'
            onChange={this.handleChangePhrase}
            onPaste={this.onCopyOrPastePhrase}
            required
            value={phraseRewrite}
          />

          <nav className='form-nav -space-around'>
            <button
              className='button -back'
              onClick={history.goBack}
              type='button'
            >
              Back
            </button>
            <button className='button' disabled={phraseRewrite !== phrase}>
              Next
            </button>
          </nav>
        </form>
      </div>
    );
  }

  renderTips () {
    return (
      <div className='text -space-around'>
        <div className='text -tiny'>
          Keep it secure and secret.
          <ul className='-bulleted'>
            <li>You can view and save the recovery phrase later on.</li>
            <li>
              If someone gets hold of your secret phrase, they will be able to
              drain your account.
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FlaggedPhraseRewrite;
