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
import { toWei, fromWei } from '@parity/api/lib/util/wei';
import { withProps } from 'recompose';

import { estimateGas } from '../../utils/estimateGas';
import RequireHealth from '../../RequireHealthOverlay';
import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withAccount from '../../utils/withAccount.js';
import withBalance, { withEthBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

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
  state = {
    maxSelected: false
  };
  handleSubmit = values => {
    const { accountAddress, history, sendStore, token } = this.props;

    sendStore.setTx(values);
    history.push(`/send/${token.address}/from/${accountAddress}/signer`);
  };

  launchEstimation = createDecorator(
    {
      field: /to|amount/, // when the value of these fields change...
      updates: {
        // ...set field "gas"
        gas: (value, allValues) => {
          const { parityStore, token } = this.props;
          if (this.preValidate(allValues) === true) {
            return estimateGas(allValues, token, parityStore.api);
          } else {
            return null;
          }
        }
      }
    },
    {
      field: /gas|gasPrice/, // when the value of these fields change...
      updates: {
        // ...set field "gas"
        amount: (value, allValues) => {
          if (this.state.maxSelected) {
            return this.calculateMax(allValues.gas, allValues.gasPrice);
          } else {
            // This return is needed for the amount not to be set to 0 when Max is deactivated and gasPrice changes
            // TODO understand why returning "value" here makes the amount field change when gasPrice changes..
            return allValues.amount;
          }
        }
      }
    }
  );

  calculateMax = (gas, gasPrice) => {
    const { token, balance } = this.props;

    const gasBn = gas ? new BigNumber(gas) : new BigNumber(21000);
    const gasPriceBn = new BigNumber(gasPrice);

    return token.address === 'ETH'
      ? fromWei(toWei(balance).minus(gasBn.mul(toWei(gasPriceBn, 'shannon'))))
      : balance;
  };

  render () {
    const {
      accountAddress,
      sendStore: { tx },
      token
    } = this.props;

    const toggleMax = ([name], state, { changeValue }) => {
      if (!this.state.maxSelected) {
        changeValue(state, 'amount', value => {
          return this.calculateMax(
            state.formState.values.gas,
            state.formState.values.gasPrice
          );
        });
      }
      this.setState({ maxSelected: !this.state.maxSelected });
    };

    const recalculateMax = ([name], state, { changeValue }) => {
      if (this.state.maxSelected) {
        changeValue(state, 'amount', value => {
          return this.calculateMax(
            state.formState.values.gas,
            state.formState.values.gasPrice
          );
        });
      }
    };

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
                    decorators={[this.launchEstimation]}
                    mutators={{ toggleMax, recalculateMax }}
                    render={({
                      handleSubmit,
                      valid,
                      validating,
                      values,
                      form: { mutators }
                    }) => (
                      <form className='send-form' onSubmit={handleSubmit}>
                        <fieldset className='form_fields'>
                          <Field
                            className='form_field_amount'
                            formNoValidate
                            label='Amount'
                            name='amount'
                            disabled={this.state.maxSelected}
                            placeholder='0.00'
                            render={FetherForm.Field}
                            required
                            type='number' // In ETH or coin
                          >
                            <FetherForm.ToggleButton
                              label='Max'
                              name='max'
                              active={this.state.maxSelected}
                              onClick={mutators.toggleMax}
                            />
                          </Field>

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
                            label='Transaction Fee'
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
    const amount = +values.amount;
    const amountBn = new BigNumber(amount);

    if (!amount || isNaN(amount)) {
      return { amount: 'Please enter a valid amount' };
    } else if (amount < 0) {
      return { amount: 'Please enter a positive amount' };
    } else if (token.symbol === 'ETH' && toWei(amount).lt(1)) {
      return { amount: 'Please enter at least 1 Wei' };
    } else if (token.symbol !== 'ETH' && amountBn.dp() > token.decimals) {
      return {
        amount: `Please enter a ${token.name} value of at least ${
          token.decimals
        } decimal places`
      };
    } else if (balance && balance.lt(amount)) {
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

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        values.gas
          .mul(toWei(values.gasPrice, 'shannon'))
          .plus(token.address === 'ETH' ? toWei(values.amount) : 0)
          .gt(toWei(ethBalance))
      ) {
        return { amount: "You don't have enough ETH balance" };
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
