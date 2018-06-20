// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { FormField, Header } from 'light-ui';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withBalance from '../../utils/withBalance';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

@inject('sendStore')
@withBalance(({ sendStore: { token } }) => token)
@observer
class Send extends Component {
  componentDidMount () {
    this.props.sendStore.estimateGas();
  }

  getMaxAmount = () => {
    const {
      balance,
      sendStore: { estimated, tx }
    } = this.props;

    // TODO this in sendStore as @computed?
    return balance && estimated
      ? +fromWei(
        toWei(balance).minus(
          estimated.multipliedBy(toWei(tx.gasPrice, 'shannon'))
        )
      )
      : 0.01;
  };

  handleChangeAmount = ({ target: { value } }) =>
    this.props.sendStore.setTxAmount(value);

  handleChangeGasPrice = ({ target: { value } }) =>
    this.props.sendStore.setTxGasPrice(value);

  handleChangeTo = ({ target: { value } }) => {
    const { sendStore } = this.props;
    sendStore.setTxTo(value);
    // Estimate the gas to this address, if we're sending ETH.
    if (sendStore.tokenAddress === 'ETH') {
      sendStore.estimateGas();
    }
  };

  handleMax = () => this.props.sendStore.setTxAmount(this.getMaxAmount());

  handleSubmit = e => {
    e.preventDefault();
    const { history, sendStore } = this.props;

    // Post a request to the transaction. There is a next step to sign this
    // request.
    sendStore.send();

    history.push('/send/signer');
  };

  render () {
    const {
      sendStore: { token, tx }
    } = this.props;

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
              decimals={6}
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
                            max={this.getMaxAmount()}
                            min={0}
                            onChange={this.handleChangeAmount}
                            placeholder='1.00'
                            required
                            step={10 ** -token.decimals}
                            type='number'
                            value={tx.amount}
                          />
                          <nav className='form-field_nav'>
                            <button
                              className='button -utility'
                              onClick={this.handleMax}
                              type='button'
                            >
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
                          pattern={/^0x[a-fA-F0-9]{40}$/}
                          placeholder='0x...'
                          required
                          title='Invalid address'
                          type='text'
                          value={tx.to}
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
                            step={0.5}
                            type='range'
                            value={tx.gasPrice}
                          />
                          <nav className='range-nav'>
                            <span className='range-nav_label'>Cheap</span>
                            <span className='range-nav_value'>
                              {tx.gasPrice} Gwei
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
