// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { FormField, Header } from 'light-ui';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withBalance from '../../utils/withBalance';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

@inject('sendStore')
@withBalance(({ sendStore: { token } }) => token)
@observer
class Send extends Component {
  state = {
    amount: '', // In Ether or in token
    gasPrice: 4, // in Gwei
    to: '',
    ...this.props.sendStore.tx
  };

  componentDidUpdate () {
    if (!this.hasErrors()) {
      const { amount, gasPrice, to } = this.state;
      this.props.sendStore.setTx({ amount, gasPrice, to });
      this.estimateGas();
    }
  }

  estimateGas = debounce(() => {
    this.props.sendStore.estimateGas();
  }, 1000);

  static getDerivedStateFromProps (nextProps, prevState) {
    const {
      balance,
      sendStore: { estimated }
    } = nextProps;

    return {
      maxAmount:
        balance && estimated
          ? +fromWei(
            toWei(balance).minus(
              estimated.mul(toWei(prevState.gasPrice, 'shannon'))
            )
          )
          : 0.01
    };
  }

  handleChangeAmount = ({ target: { value } }) =>
    this.setState({ amount: value });

  handleChangeGasPrice = ({ target: { value } }) =>
    this.setState({ gasPrice: value });

  handleChangeTo = ({ target: { value } }) => {
    this.setState({ to: value });
  };

  handleMax = () => this.setState({ amount: this.state.maxAmount });

  handleSubmit = e => {
    e.preventDefault();
    const { history, sendStore } = this.props;

    // Post a request to the transaction. There is a next step to sign this
    // request.
    sendStore.send();

    history.push('/send/signer');
  };

  /**
   * Get form errors.
   *
   * TODO Use a React form library to do this?
   */
  hasErrors = () => {
    const { amount, maxAmount, to } = this.state;
    if (!amount || isNaN(amount)) {
      return 'Please enter a valid amount';
    }

    if (amount < 0) {
      return 'Please enter a positive amount ';
    }

    if (amount > maxAmount) {
      return "You don't have enough balance";
    }

    if (!isAddress(to)) {
      return 'Please enter a valid Ethereum address';
    }

    return null;
  };

  render () {
    const {
      sendStore: { token }
    } = this.props;
    const { amount, gasPrice, maxAmount, to } = this.state;

    const errors = this.hasErrors();

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
                            formNoValidate
                            max={maxAmount}
                            min={0}
                            onChange={this.handleChangeAmount}
                            required
                            step={+fromWei(1)}
                            type='number'
                            value={amount}
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
                        <input
                          className='-sm'
                          onChange={this.handleChangeTo}
                          placeholder='0x...'
                          required
                          type='text'
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
                            step={0.5}
                            type='range'
                            value={gasPrice}
                          />
                          <nav className='range-nav'>
                            <span className='range-nav_label'>Cheap</span>
                            <span className='range-nav_value'>
                              {gasPrice} Gwei
                            </span>
                            <span className='range-nav_label'>Fast</span>
                          </nav>
                        </div>
                      }
                      label='Gas'
                    />
                  </fieldset>
                  <nav className='form-nav'>
                    <span data-tip={errors || ''}>
                      <button disabled={errors} className='button'>
                        Send
                      </button>
                    </span>
                  </nav>
                </form>
              ]}
              onClick={null}
              token={token}
            />
          </div>
        </div>
        <ReactTooltip
          effect='solid'
          event='mouseover'
          eventOff='mouseout'
          place='top'
        />
      </div>
    );
  }
}

export default Send;
