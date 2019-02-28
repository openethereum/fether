// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause
import * as CryptoJS from 'crypto-js';
import { AccountCard, Header, Form as FetherForm } from 'fether-ui';
import localForage from 'localforage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RequireHealthOverlay from '../RequireHealthOverlay';
import withAccount from '../utils/withAccount';
import Health from '../Health';

/*
  The user skipped phrase rewrite during account creation.
  Then ->
    Two cases:
    1. The user hasn't confirmed recovery phrase backup yet.
      -> In this case we show a warning and guide them to decrypt the phrase with their password and through to the rewrite step.
    2. The user has confirmed backup of their recovery phrase, but just wants to view it once more.
      -> In this case, we do not show warning, but we alow them to decrypt the phrase with their password.
*/
@inject('parityStore')
@withAccount
class BackupPhrase extends Component {
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

  handleSubmit = async event => {
    const {
      account: { address },
      history
    } = this.props;
    const { password, phrase } = this.state;

    // unset account flag
    await localForage.removeItem(`__flagged_${address}`);

    // AES encrypt the phrase
    const encryptedPhrase = CryptoJS.AES.encrypt(phrase, password).toString();

    // set flag as safe
    await localForage.setItem(`__safe_${address}`, encryptedPhrase);

    // go to account
    history.push(`/tokens/${address}`);
  };

  // Get the actual phrase to rewrite
  getPhrase = async () => {
    const {
      account: { address }
    } = this.props;

    const phrase =
      (await localForage.getItem(`__flagged_${address}`)) ||
      (await localForage.getItem(`__safe_${address}`));

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
    const {
      account: { address },
      history,
      location: { pathname }
    } = this.props;

    event.preventDefault();

    const needsRewrite = pathname.split('/')[3] === 'true';

    if (!needsRewrite) {
      history.push(`/tokens/${address}`);
    }

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
      // this will throw in the case of a wrong password
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
      account: { address, name },
      location: { pathname }
    } = this.props;
    const { error, unlocked } = this.state;

    const needsRewrite = pathname.split('/')[3] === 'true';

    const title = needsRewrite
      ? 'Backup Recovery Phrase'
      : 'View Recovery Phrase';

    return (
      <div>
        <Header
          left={
            <Link className='icon -back' to='/accounts'>
              Back
            </Link>
          }
          title={<h1>{title}</h1>}
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
                    {needsRewrite && unlocked ? this.renderTips() : null}
                    {error}
                  </div>
                ]}
              />
              <nav className='footer-nav'>
                <div className='footer-nav_status'>
                  <Health />
                </div>
              </nav>
            </RequireHealthOverlay>
          </div>
        </div>
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
    const {
      location: { pathname }
    } = this.props;

    const needsRewrite = pathname.split('/')[3] === 'true';

    return (
      <div>
        <div className='text -centered'>
          {needsRewrite
            ? 'Please write your recovery phrase on a piece of paper.'
            : 'Make sure not to let anyone see your recovery phrase.'}
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
            {needsRewrite ? 'Next' : 'Done'}
          </button>
        </nav>
      </div>
    );
  }

  renderPasswordForm () {
    const { history } = this.props;
    const { password } = this.state;

    return (
      <div>
        <div className='text -centered'>
          Unlock your account to view your recovery phrase.
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
    const { step } = this.state;
    // add fade animation as final attention to the important message before confirmation.
    const classname = `text ${step === 2 ? '-fade' : ''} -space-around`;

    return (
      <div className={classname}>
        <b>IMPORTANT</b>
        <div className='text -tiny'>
          <ul className='-bulleted'>
            <li>
              {' '}
              Copy down your recovery phrase somewhere secure in case you need
              to recover your account in the future.{' '}
              <b> Skipping this step is NOT recommended. </b>
            </li>
            <li>
              {' '}
              You can view and copy your recovery phrase later on by selecting
              "View Recovery Phrase" from your account.{' '}
              <b> Note that you need your account password to do so. </b>{' '}
            </li>
            <li>
              {' '}
              If you lose your recovery phrase and you did not perform a JSON
              Backup (select "Backup Account" from the account menu),{' '}
              <b> your wallet cannot be recovered </b>{' '}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default BackupPhrase;
