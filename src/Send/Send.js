// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { defaultAccount$, post$ } from '@parity/light.js';
import { Redirect } from 'react-router-dom';
import { toWei } from '@parity/api/lib/util/wei';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import light from '../hoc';

@light({
  me: defaultAccount$
})
class Send extends Component {
  state = {
    amount: 0.01, // In Ether
    gas: 21000,
    to: '0x00Ae02834e91810B223E54ce3f9B7875258a1747',
    txStatus: null
  };

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleChangeAmount = ({ target: { value } }) =>
    this.setState({ amount: value });

  handleChangeGas = ({ target: { value } }) => this.setState({ gas: value });

  handleChangeTo = ({ target: { value } }) => this.setState({ to: value });

  handleSubmit = e => {
    e.preventDefault();
    const { me } = this.props;
    const { amount, gas, to } = this.state;

    this.subscription = post$({
      from: me,
      gas,
      to,
      value: toWei(amount)
    }).subscribe(status => this.setState({ status }));
  };

  render () {
    const { amount, gas, status, to } = this.state;

    if (status && status.requested) {
      // Redirect to signer when needed
      return <Redirect to={`/signer/${+status.requested}`} />;
    }

    return (
      <div className='box -well'>
        <div className='box -card'>
          <header className='token -header'>
            <div className='token_icon'>
              <img src={ethereumIcon} alt='ethereum' />
            </div>
            <div className='token_name'>Ethereum</div>
            <div className='token_balance'>
              42.89
              <span className='token_symbol'>ETH</span>
            </div>
          </header>

          <form className='send-form' onSubmit={this.handleSubmit}>
            {/* @brian can we not use ul/li here? Not really semantic. I could
            change it but I'm scared it'll break the layout */}
            <ul className='send-form_fields'>
              <li>
                <label>Address</label>
                <input
                  onChange={this.handleChangeTo}
                  required
                  type='tel'
                  value={to}
                />
              </li>
              <li>
                <label>Amount</label>
                <input
                  onChange={this.handleChangeAmount}
                  required
                  type='tel'
                  value={amount}
                />
              </li>
              <li>
                <label>Gas</label>
                <input
                  onChange={this.handleChangeGas}
                  required
                  type='tel'
                  value={gas}
                />
              </li>
            </ul>
            <div className='send-form_action'>
              <button className='button'>Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Send;
