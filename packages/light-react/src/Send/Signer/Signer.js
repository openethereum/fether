// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import TokenBalance from '../TokenBalance';

@inject('sendStore')
@observer
class Signer extends Component {
  state = {
    password: ''
  };

  handleAccept = e => {
    const { history, sendStore } = this.props;
    const { password } = this.state;

    e.preventDefault();

    sendStore.acceptRequest(password).then(() => history.push('/send/sent'));
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleReject = () => {
    const { history, sendStore } = this.props;
    sendStore.rejectRequest().then(() => history.goBack());
  };

  render () {
    const {
      sendStore: { token, tx }
    } = this.props;
    const { password } = this.state;

    return (
      <div className='box -card'>
        <TokenBalance token={token} />
        <div className='box -card-drawer'>
          <div className='form_field'>
            <label>Amount</label>
            <div className='form_field_value'>
              {token.amount} {token.symbol}
            </div>
          </div>
          <div className='form_field'>
            <label>To</label>
            <div className='form_field_value'>{tx.to}</div>
          </div>
        </div>
        <form className='box -card-drawer' onSubmit={this.handleAccept}>
          <div className='text'>
            <p>Enter your password to confirm this transaction.</p>
          </div>
          <div className='form_field'>
            <label>Password</label>
            <input
              onChange={this.handleChangePassword}
              required
              type='password'
              value={password}
            />
          </div>
          <nav className='form-nav -binary'>
            <button
              className='button -cancel'
              onClick={this.handleReject}
              type='button'
            >
              Cancel
            </button>
            <button className='button -submit'>Confirm transaction</button>
          </nav>
        </form>
      </div>
    );
  }
}

export default Signer;
