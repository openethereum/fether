// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { defaultAccount$ } from '@parity/light.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { FormField, Header } from 'light-ui';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

@light({
  defaultAccount: defaultAccount$
})
@inject('sendStore')
@observer
class Send extends Component {
  state = {
    amount: 0.01, // In Ether or in token
    gasPrice: 4, // in Gwei
    to: '0x00Ae02834e91810B223E54ce3f9B7875258a1747'
  };

  handleChangeAmount = ({ target: { value } }) =>
    this.setState({ amount: value });

  handleChangeGasPrice = ({ target: { value } }) =>
    this.setState({ gasPrice: value });

  handleChangeTo = ({ target: { value } }) => {
    this.setState({ to: value }, () => {
      // Estimate the gas to this address.
      this.props.sendStore.estimateGas(this.state);
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { defaultAccount, history, sendStore } = this.props;
    const { amount, gasPrice, to } = this.state;

    // Post a request to the transaction. There is a next step to sign this
    // request.
    sendStore.postTx({
      from: defaultAccount,
      gasPrice: toWei(gasPrice, 'shannon'), // shannon == gwei
      to,
      value: toWei(amount)
    });

    history.push('/send/signer');
  };

  render () {
    const {
      sendStore: { estimated, token }
    } = this.props;
    const { amount, gasPrice, to } = this.state;

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
                <form
                  className='send-form'
                  key='txForm'
                  onSubmit={this.handleSubmit}
                >
                  <fieldset className='form_fields'>
                    <FormField
                      input={
                        <div>
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
                      }
                      label='Amount'
                    />

                    <FormField
                      input={
                        <textarea
                          className='-sm'
                          onChange={this.handleChangeTo}
                          required
                          type='text'
                          placeholder='Recipient address'
                          value={to}
                        />
                      }
                      label='To'
                    />

                    <FormField
                      className='-range'
                      input={
                        <div>
                          <input
                            max={MAX_GAS_PRICE}
                            min={MIN_GAS_PRICE}
                            onChange={this.handleChangeGasPrice}
                            required
                            step={0.1}
                            type='range'
                            value={gasPrice}
                          />
                          <nav className='range-nav'>
                            <span className='range-nav_label'>Cheap</span>
                            <span className='range-nav_value'>
                              {fromWei(
                                toWei(gasPrice, 'shannon').mul(estimated)
                              ).toFixed(6)}{' '}
                              ETH
                            </span>
                            <span className='range-nav_label'>Fast</span>
                          </nav>
                        </div>
                      }
                      label='Gas'
                    />
                  </fieldset>
                  <nav className='form-nav'>
                    <button className='button'>Send</button>
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

export default Send;
