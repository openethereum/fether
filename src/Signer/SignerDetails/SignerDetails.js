// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { fromWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import From from './From';

@inject('signerStore')
@observer
class SignerDetails extends Component {
  state = {
    password: ''
  };

  handleAccept = () => {
    const {
      match: {
        params: { requestId }
      },
      signerStore
    } = this.props;
    const { password } = this.state;
    signerStore.acceptRequest(requestId, password);
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleReject = () => {
    const {
      match: {
        params: { requestId }
      },
      signerStore
    } = this.props;
    signerStore.rejectRequest(requestId);
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const {
      match: {
        params: { requestId }
      },
      signerStore: { requests }
    } = this.props;
    const { password } = this.state;
    const request = requests[requestId];

    if (!request) {
      // This happens after we accept/reject a request
      return null;
    }

    const transaction = request.payload.sendTransaction;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Request number {requestId}</h3>
        <p>From: {transaction.from}</p>
        <p>To: {transaction.to}</p>
        <p>Amount: {+fromWei(transaction.value)}ETH</p>
        <p>Gas: {+transaction.gas}</p>
        <label>
          Enter your password to confirm:<br />
          <input
            onChange={this.handleChangePassword}
            required
            type="password"
            value={password}
          />
        </label>
        <br />
        <button onClick={this.handleAccept}>Accept</button>{' '}
        <button onClick={this.handleReject}>Reject (no pw needed)</button>
        <br />
        <em style={{ fontSize: 10 }}>
          @brian, for now for errors look in console, e.g. when nothing happens
          when you click on Accept
        </em>
      </form>
    );
  }
}

export default SignerDetails;
