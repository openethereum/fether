// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { fromWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { post$ } from '@parity/light.js';

@inject('signerStore')
@observer
class Signer extends Component {
  state = {
    password: '',
    status: null
  };

  componentWillMount () {
    // If we accessed this URL via URL change, then something's not right, so
    // we go back. If we accessed after the Send page, then location.state is
    // set as the tx.
    if (!this.props.location.state) {
      this.props.history.goBack();
    }
  }

  componentDidMount () {
    const tx = this.props.location.state;
    this.subscription = post$(tx).subscribe(status => {
      if (status.requested) {
        this.requestId = status.requested;
      }
      this.setState({ status });
    });
  }

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleAccept = () => {
    const { signerStore } = this.props;
    const { password } = this.state;
    signerStore.acceptRequest(this.requestId, password);
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleReject = () => {
    const { history, signerStore } = this.props;
    signerStore.rejectRequest(this.requestId).then(() => history.goBack());
  };

  handleSubmit = e => {
    e.preventDefault();
    this.handleAccept();
  };

  render () {
    const { location: { state: tx } } = this.props;
    const { password, status } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>
          Request number {this.requestId}
        </h3>
        <p>
          From: {tx.from}
        </p>
        <p>
          To: {tx.to}
        </p>
        <p>
          Amount: {+fromWei(tx.value)}ETH
        </p>
        <p>
          Gas: {+tx.gas}
        </p>
        {status && status.requested
          ? <div>
            <label>
                Enter your password to confirm:<br />
              <input
                onChange={this.handleChangePassword}
                required
                type='password'
                value={password}
              />
            </label>
            <br />
            <button>Accept</button>{' '}
            <button onClick={this.handleReject} type='button'>
                Reject (no pw needed)
            </button>
            <br />
            <em style={{ fontSize: 10 }}>
                @brian, for now for errors look in console, e.g. when nothing
                happens when you click on Accept
            </em>
          </div>
          : <p>Loading...</p>}
        <br />
        <br />
        <p>
          Status: {JSON.stringify(status)}
        </p>
      </form>
    );
  }
}

export default Signer;
