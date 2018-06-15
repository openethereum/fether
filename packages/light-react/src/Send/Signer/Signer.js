// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { FormField, Header } from 'light-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';

@inject('sendStore')
@observer
class Signer extends Component {
  state = {
    isSending: false,
    password: ''
  };

  handleAccept = e => {
    const { history, sendStore } = this.props;
    const { password } = this.state;

    e.preventDefault();

    this.setState({ isSending: true }, () => {
      sendStore
        .acceptRequest(password)
        .then(() => history.push('/send/sent'))
        .catch(() => this.setState({ isSending: false }));
    });
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleReject = () => {
    const { history, sendStore } = this.props;

    this.setState({ isSending: true }, () => {
      sendStore
        .rejectRequest()
        .then(() => history.goBack())
        .catch(() => history.goBack());
    });
  };

  render () {
    const {
      sendStore: { token, tx, txStatus }
    } = this.props;
    const { isSending, password } = this.state;

    return (
      <div>
        <Header
          left={
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          }
          title={<h1>Send {token.name}</h1>}
        />

        <div className='window_content'>
          <div className='box -padded'>
            <TokenBalance
              drawers={[
                <div key='txForm'>
                  <div className='form_field'>
                    <label>Amount</label>
                    <div className='form_field_value'>
                      {tx.amount} {token.symbol}
                    </div>
                  </div>
                  <div className='form_field'>
                    <label>To</label>
                    <div className='form_field_value'>{tx.to}</div>
                  </div>
                </div>,
                <form key='signerForm' onSubmit={this.handleAccept}>
                  <div className='text'>
                    <p>Enter your password to confirm this transaction.</p>
                  </div>

                  <FormField
                    label='Password'
                    onChange={this.handleChangePassword}
                    required
                    type='password'
                    value={password}
                  />

                  <nav className='form-nav -binary'>
                    <button
                      className='button -cancel'
                      onClick={this.handleReject}
                      type='button'
                    >
                      Cancel
                    </button>
                    <button
                      className='button -submit'
                      disabled={!txStatus || !txStatus.requested || isSending}
                    >
                      Confirm transaction
                    </button>
                  </nav>
                </form>
              ]}
              onClick={null}
              token={token}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Signer;
