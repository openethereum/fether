// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause
import * as CryptoJS from 'crypto-js';
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
    step: 1,
    unlocked: false
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

    // phrase is still encrypted
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

  nextStep = event => {
    event.preventDefault();
    this.setState({
      step: this.state.step + 1
    });
  };

  prevStep = () => {
    const {
      account: { address },
      history
    } = this.props;
    const { step } = this.state;

    if (step === 1) {
      history.push(`/tokens/${address}`);
    }

    this.setState({
      step: step - 1
    });
  };

  // Decrypt the encrypted phrase from state
  unlockWithPassword = async event => {
    const { password, phrase } = this.state;

    try {
      // decrypt the phrase
      var phraseInBytes = CryptoJS.AES.decrypt(phrase, password);
      var originalPhrase = phraseInBytes.toString(CryptoJS.enc.Utf8);

      if (!originalPhrase) {
        throw new Error('Incorrect password');
      }

      this.setState({
        error: null,
        phrase: originalPhrase,
        unlocked: true
      });
    } catch (error) {
      event.preventDefault();

      this.setState({
        error: error.message + '. \n Please check your password and try again.'
      });

      return false;
    }
  };

  render () {
    const {
      account: { address, name }
    } = this.props;
    const { error, unlocked } = this.state;

    return (
      <div>
        <Header
          left={
            <Link className='icon -back' to='/accounts'>
              Back
            </Link>
          }
          title={<h1>Backup Recovery Phrase</h1>}
        />

        <div className='window_content'>
          <div className='box -padded'>
            <RequireHealthOverlay require='node'>
              <AccountCard
                address={address}
                name={name}
                drawers={[
                  <div>
                    {unlocked
                      ? this.renderCopyAndRewrite()
                      : this.renderPasswordForm()}
                    {this.renderTips()}
                    {error}
                    <nav className='footer-nav'>
                      <div className='footer-nav_status'>
                        <Health />
                      </div>
                    </nav>
                  </div>
                ]}
              />
            </RequireHealthOverlay>
          </div>
        </div>
      </div>
    );
  }

  renderPasswordForm () {
    const { history } = this.props;
    const { password } = this.state;

    return (
      <div>
        <div className='text -centered'>
          Unlock your account to view and backup your recovery phrase.
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

  renderCopyAndRewrite () {
    const { step } = this.state;

    if (step === 1) {
      return this.renderCopyForm();
    } else {
      return this.renderRewriteForm();
    }
  }

  renderCopyForm () {
    const { phrase } = this.state;

    return (
      <div>
        <div className='text -centered'>
          Please write your recovery phrase on a piece of paper.
        </div>
        <div
          className='text -code -space-around'
          onCopy={this.onCopyOrPastePhrase}
        >
          {phrase}
        </div>
        <nav className='form-nav -space-around'>
          <button
            className='button -back'
            onClick={this.prevStep}
            type='button'
          >
            Back
          </button>
          <button className='button' onClick={this.nextStep}>
            Next
          </button>
        </nav>
      </div>
    );
  }

  renderRewriteForm () {
    const { phrase, phraseRewrite } = this.state;

    return (
      <div>
        <div className='text -centered'>
          Rewrite it below to confirm you have backed it up somewhere safe.
        </div>
        <form key='rewritePhrase' onSubmit={this.handleSubmit}>
          <FetherForm.Field
            autoFocus
            as='textarea'
            label='Recovery phrase'
            onChange={this.handleChangePhrase}
            onPaste={this.onCopyOrPastePhrase}
            required
            rows={3}
            value={phraseRewrite}
          />

          <nav className='form-nav -space-around'>
            <button
              className='button -back'
              onClick={this.prevStep}
              type='button'
            >
              Back
            </button>
            <button
              autoFocus
              className='button'
              disabled={phraseRewrite !== phrase}
            >
              Confirm
            </button>
          </nav>
        </form>
      </div>
    );
  }

  renderTips () {
    return (
      <div className='text -space-around'>
        <b>IMPORTANT</b>
        <div className='text -tiny'>
          <ul className='-bulleted'>
            <li>
              <b>
                Once you confirm your recovery phrase, you will not be able to
                view it again.
              </b>{' '}
              You MUST make sure it is somewhere safe & accessible.
            </li>
            <li>
              <b>
                If you lose your recovery phrase, your wallet cannot be
                recovered
              </b>{' '}
              unless you choose to backup your account to a password encrypted
              JSON file. You must remember this password!
            </li>
            <li>
              <b>
                If someone gets hold of your recovery phrase, they will be able
                to drain your account.
              </b>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FlaggedPhraseRewrite;
