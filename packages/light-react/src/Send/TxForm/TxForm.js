// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { defaultAccount$ } from '@parity/light.js';
import { toWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';
import { inject, observer } from 'mobx-react';

import TokenBalance from '../TokenBalance';

@light({
  defaultAccount: defaultAccount$
})
@inject('sendStore')
@observer
class Send extends Component {
  state = {
    amount: 0.01, // In Ether or in token
    gas: 21000,
    to: '0x00Ae02834e91810B223E54ce3f9B7875258a1747'
  };

  handleChangeAmount = ({ target: { value } }) =>
    this.setState({ amount: value });

  handleChangeGas = ({ target: { value } }) => this.setState({ gas: value });

  handleChangeTo = ({ target: { value } }) => this.setState({ to: value });

  handleSubmit = e => {
    e.preventDefault();
    const { defaultAccount, history, sendStore } = this.props;
    const { amount, gas, to } = this.state;

    // Post a request to the transaction. There is a next step to sign this
    // request.
    sendStore.postTx({
      from: defaultAccount,
      gas,
      to,
      value: toWei(amount)
    });

    history.push('/send/signer');
  };

  render () {
    const {
      sendStore: { token }
    } = this.props;
    const { amount, gas, to } = this.state;

    return (
      <div className='box -card'>
        <TokenBalance token={token} />
        <div className='box -card-drawer'>
          <form className='send-form' onSubmit={this.handleSubmit}>
            <fieldset className='form_fields'>
              <div className='form_field'>
                <label>Amount</label>
                <input
                  className='form_field_amount'
                  onChange={this.handleChangeAmount}
                  required
                  type='number'
                  value={amount}
                />
                <nav className='form-field_nav'>
                  <button className='button -utility' type='button'>
                    Max
                  </button>
                </nav>
              </div>
              <div className='form_field'>
                <label>To</label>
                <textarea
                  className='-sm'
                  onChange={this.handleChangeTo}
                  required
                  type='text'
                  placeholder='Recipient address'
                  value={to}
                />
              </div>
              <div className='form_field -range'>
                <label>Gas</label>
                <input
                  onChange={this.handleChangeGas}
                  required
                  min='1'
                  max='44000'
                  type='range'
                  value={gas}
                />
                <nav className='range-nav'>
                  <span className='range-nav_label'>Cheap</span>
                  <span className='range-nav_value'>{gas}</span>
                  <span className='range-nav_label'>Fast</span>
                </nav>
              </div>
            </fieldset>
            <nav className='form-nav'>
              <button className='button'>Send</button>
            </nav>
          </form>
        </div>
      </div>
    );
  }
}

export default Send;
