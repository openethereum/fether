// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountHeader, Card, Form as FetherForm } from 'fether-ui';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import backupAccount from '../utils/backupAccount';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
@observer
class BackupAccount extends Component {
  state = {
    isLoading: false,
    password: '',
    message: ''
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = event => {
    const {
      account: { address },
      history
    } = this.props;
    const { password } = this.state;

    event && event.preventDefault();

    this.setState({ isLoading: true });

    backupAccount(address, password)
      .then(res => {
        /*
          FIXME: this timeout is a placeholder for after the backup file is saved.
          AFAICT there is no callback from FileSaver.saveAs() so I'm not sure how to handle this yet.
          If it just goes straight to the accounts page it's not clear anything happened at all, and
          a little loading time however arbitrary at least gives the sense that something's happened.
        */
        setTimeout(() => history.push(`/accounts`), 3000);
      })
      .catch(err => {
        this.setState({
          message: err.text + ' Please check your password and try again.'
        });
        this.setState({ isLoading: false });
      });
  };

  render () {
    const {
      account: { name, address, type },
      history
    } = this.props;
    const { isLoading, message, password } = this.state;

    return (
      <div>
        <AccountHeader
          address={address}
          copyAddress
          name={name}
          type={type}
          left={
            <Link to='/accounts' className='icon -back'>
              Back
            </Link>
          }
        />
        <br />
        <Card className='-space-around'>
          <form key='backupAccount' onSubmit={this.handleSubmit}>
            <div className='text'>
              <p>Unlock your account to encrypt the JSON keystore file:</p>
            </div>

            <FetherForm.Field
              label='Password'
              onChange={this.handlePasswordChange}
              autoFocus
              required
              type='password'
              value={password}
            />

            <p className='error'> {message} </p>

            <nav className='form-nav -space-around'>
              <button
                className='button -back'
                onClick={history.goBack}
                type='button'
              >
                Back
              </button>
              <button
                className='button'
                disabled={!password || isLoading}
                autoFocus
              >
                Confirm backup
              </button>
            </nav>
          </form>
        </Card>
      </div>
    );
  }
}

export default BackupAccount;
