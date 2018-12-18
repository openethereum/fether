// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import createDecorator from 'final-form-calculate';
import debounce from 'debounce-promise';
import { Field, Form } from 'react-final-form';
import { Form as FetherForm, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import { Link } from 'react-router-dom';
import { toWei } from '@parity/api/lib/util/wei';
import { withProps } from 'recompose';

import { estimateGas } from '../../utils/estimateGas';
import RequireHealth from '../../RequireHealthOverlay';
import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withAccount from '../../utils/withAccount.js';
import withBalance, { withEthBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei
const ZERO = new BigNumber('0');

@inject('parityStore', 'sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@withAccount
@withBalance // Balance of current token (can be ETH)
@withEthBalance // ETH balance
@observer
class Send extends Component {
  isCancelled = false;

  state = {
    estimatedTxFee: ZERO
  };

  componentWillUnmount () {
    // Avoids encountering error `Can't call setState (or forceUpdate)
    // on an unmounted component` when navigate from 'Send Ether' to 'Send THIBCoin'
    this.isCancelled = true;
  }

  handleSubmit = values => {
    const { accountAddress, history, sendStore, token } = this.props;

    sendStore.setTx(values);
    history.push(`/send/${token.address}/from/${accountAddress}/signer`);
  };

  decorator = createDecorator({
    field: /to|amount/, // when the value of these fields change...
    updates: {
      // ...set field "gas"
      gas: (value, allValues) => {
        const { parityStore, token } = this.props;

        !this.isCancelled && this.setState({ estimatedTxFee: ZERO });

        if (this.preValidate(allValues) === true) {
          return estimateGas(allValues, token, parityStore.api);
        } else {
          return null;
        }
      }
    }
  });

  render () {
    const {
      accountAddress,
      sendStore: { tx },
      token
    } = this.props;

    const { estimatedTxFee } = this.state;

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${accountAddress}`} className='icon -back'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <RequireHealth require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <TokenBalance
                decimals={6}
                drawers={[
                  <Form
                    key='txForm'
                    initialValues={{ from: accountAddress, gasPrice: 4, ...tx }}
                    onSubmit={this.handleSubmit}
                    validate={this.validateForm}
                    decorators={[this.decorator]}
                    render={({ handleSubmit, valid, validating, values }) => (
                      <form className='send-form' onSubmit={handleSubmit}>
                        <fieldset className='form_fields'>
                          <Field
                            className='form_field_amount'
                            formNoValidate
                            label='Amount'
                            name='amount'
                            placeholder='0.00'
                            render={FetherForm.Field}
                            required
                            type='number' // In ETH or coin
                          />

                          <Field
                            as='textarea'
                            className='-sm'
                            label='To'
                            name='to'
                            placeholder='0x...'
                            required
                            render={FetherForm.Field}
                          />

                          <Field
                            centerText={`${values.gasPrice} GWEI`}
                            className='-range'
                            label='Gas Price'
                            leftText='Slow'
                            max={MAX_GAS_PRICE}
                            min={MIN_GAS_PRICE}
                            name='gasPrice'
                            render={FetherForm.Slider}
                            required
                            rightText='Fast'
                            step={0.5}
                            type='range' // In Gwei
                          />
                          {estimatedTxFee &&
                            !estimatedTxFee.isZero() && (
                            <div>
                              <Field
                                as='textarea'
                                className='-xs'
                                label='Transaction Fee (Estimate)'
                                name='txFeeEstimate'
                                render={FetherForm.Field}
                                placeholder={`${estimatedTxFee
                                  .div(10 ** 18)
                                  .toString()} ETH`}
                              />

                              <Field
                                as='textarea'
                                className='-xs'
                                label='Total Amount (Estimate)'
                                name='totalAmountEstimate'
                                render={FetherForm.Field}
                                placeholder={`${estimatedTxFee
                                  .plus(
                                    token.address === 'ETH'
                                      ? toWei(values.amount)
                                      : 0
                                  )
                                  .div(10 ** 18)
                                  .toString()} ETH`}
                              />
                            </div>
                          )}
                          {values.to === values.from && (
                            <span>
                              <h3>WARNING:</h3>
                              <p>
                                The sender and receiver addresses are the same.
                              </p>
                            </span>
                          )}
                        </fieldset>
                        <nav className='form-nav'>
                          <button
                            disabled={!valid || validating}
                            className='button'
                          >
                            {validating ? 'Checking...' : 'Send'}
                          </button>
                        </nav>
                      </form>
                    )}
                  />
                ]}
                onClick={null} // To disable cursor:pointer on card // TODO Can this be done better?
                token={token}
              />
            </div>
          </div>
        </RequireHealth>
      </div>
    );
  }

  preValidate = values => {
    const { balance, token } = this.props;

    if (!values) {
      return;
    }

    if (!values.amount) {
      return { amount: 'Please enter a valid amount' };
    }

    const amountBn = new BigNumber(values.amount.toString());

    if (amountBn.isNaN()) {
      return { amount: 'Please enter a valid amount' };
    } else if (amountBn.isZero()) {
      return { amount: 'Please enter a non-zero amount' };
    } else if (amountBn.isNegative()) {
      return { amount: 'Please enter a positive amount' };
    } else if (token.symbol === 'ETH' && toWei(values.amount).lt(1)) {
      return { amount: 'Please enter at least 1 Wei' };
    } else if (token.symbol !== 'ETH' && amountBn.dp() > token.decimals) {
      return {
        amount: `Please enter a ${token.name} value of at least ${
          token.decimals
        } decimal places`
      };
    } else if (balance && balance.lt(amountBn)) {
      return { amount: `You don't have enough ${token.symbol} balance` };
    } else if (!values.to || !isAddress(values.to)) {
      return { to: 'Please enter a valid Ethereum address' };
    } else if (values.to === '0x0000000000000000000000000000000000000000') {
      return {
        to: `You are not permitted to send ${
          token.name
        } to the zero account (0x0)`
      };
    }
    return true;
  };

  /**
   * Estimate gas amount, and validate that the user has enough balance to make
   * the tx.
   */
  validateForm = debounce(values => {
    if (!values) {
      return;
    }

    try {
      const { ethBalance, token } = this.props;

      const preValidation = this.preValidate(values);
      // preValidate return an error if a field isn't valid
      if (preValidation !== true) {
        return preValidation;
      }

      if (!ethBalance || isNaN(values.gas)) {
        throw new Error('No "ethBalance" or "gas" value.');
      }

      if (!values.gas) {
        return;
      }

      const estimatedTxFee = values.gas.mul(toWei(values.gasPrice, 'shannon'));

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        estimatedTxFee
          .plus(token.address === 'ETH' ? toWei(values.amount) : 0)
          .gt(toWei(ethBalance))
      ) {
        !this.isCancelled &&
          this.setState({ estimatedTxFee: new BigNumber('0') });

        return { amount: "You don't have enough ETH balance" };
      } else {
        !this.isCancelled && this.setState({ estimatedTxFee });
      }
    } catch (err) {
      console.error(err);
      return {
        amount: 'Failed estimating balance, please try again'
      };
    }
  }, 1000);
}

export default Send;
