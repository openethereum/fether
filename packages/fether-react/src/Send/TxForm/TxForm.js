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
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import { Link } from 'react-router-dom';
import { OnChange } from 'react-final-form-listeners';
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
    estimatedTxFee: ZERO,
    maxSelected: false,
    showDetails: false
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

  toggleDetails = () => {
    const { showDetails } = this.state;

    !this.isCancelled && this.setState({ showDetails: !showDetails });
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

  calculateMax = (gas, gasPrice) => {
    const { token, balance } = this.props;
    const gasBn = gas ? new BigNumber(gas) : new BigNumber(21000);
    const gasPriceBn = new BigNumber(gasPrice);
    let output;

    if (token.address === 'ETH') {
      output = fromWei(
        toWei(balance).minus(gasBn.multipliedBy(toWei(gasPriceBn, 'shannon')))
      );
      output = output.isNegative() ? new BigNumber(0) : output;
    } else {
      output = balance;
    }
    return output;
  };

  recalculateMax = (args, state, { changeValue }) => {
    changeValue(state, 'amount', value => {
      return this.calculateMax(
        state.formState.values.gas,
        state.formState.values.gasPrice
      );
    });
  };

  toggleMax = () => {
    this.setState({ maxSelected: !this.state.maxSelected });
  };

  render () {
    const {
      accountAddress,
      sendStore: { tx },
      token
    } = this.props;

    const { estimatedTxFee, showDetails } = this.state;

    const renderFee = () => {
      return `Fee: ${estimatedTxFee
        .div(10 ** 18)
        .toFixed(9)
        .toString()} ETH (Gas Limit * Gas Price)`;
    };

    const renderCalculation = values => {
      const gasPriceBn = new BigNumber(values.gasPrice.toString());
      const gasLimitBn = estimatedTxFee
        .div(gasPriceBn)
        .div(10 ** 9)
        .toFixed(2)
        .toString();

      return `Calcs: (${gasLimitBn} WEI * ${gasPriceBn} GWEI)`;
    };

    const renderTotalAmount = values => {
      return `Total Amount: ${estimatedTxFee
        .plus(token.address === 'ETH' ? toWei(values.amount.toString()) : 0)
        .div(10 ** 18)
        .toFixed(9)
        .toString()} ETH`;
    };

    const renderDetails = values => {
      return `${renderFee()}\n${renderCalculation(values)}\n${renderTotalAmount(
        values
      )}`;
    };

    const showHideLabel = () => {
      return (
        <span className='details'>
          <a onClick={() => this.toggleDetails()}>&uarr; Hide</a>
        </span>
      );
    };

    const showDetailsLabel = () => {
      return (
        <span className='details'>
          <a onClick={() => this.toggleDetails()}>&darr; Details</a>
        </span>
      );
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
                    decorators={[this.decorator]}
                    mutators={{ recalculateMax: this.recalculateMax }}
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
                            as='textarea'
                            className='-sm'
                            label='To'
                            name='to'
                            placeholder='0x...'
                            required
                            render={FetherForm.Field}
                          />

                          <Field
                            className='form_field_amount'
                            formNoValidate
                            label='Amount'
                            name='amount'
                            disabled={this.state.maxSelected}
                            placeholder='0.00'
                            render={FetherForm.Field}
                            required
                            type='number'
                          >
                            <button
                              type='button'
                              className={
                                this.state.maxSelected
                                  ? 'button -tiny active max'
                                  : 'button -tiny max'
                              }
                              onClick={() => {
                                this.toggleMax();
                                mutators.recalculateMax();
                              }}
                            >
                              Max
                            </button>
                          </Field>

                          <Field
                            centerText={`${values.gasPrice} GWEI`}
                            className='-range'
                            label='Transaction Speed'
                            leftText='Low'
                            max={MAX_GAS_PRICE}
                            min={MIN_GAS_PRICE}
                            name='gasPrice'
                            render={FetherForm.Slider}
                            required
                            rightText='High'
                            step={0.5}
                            type='range' // In Gwei
                          />

                          {estimatedTxFee &&
                            !estimatedTxFee.isZero() && (
                            <div>
                              {valid && !isNaN(values.amount) ? (
                                <div>
                                  <div
                                    className={`form_details_buttons ${
                                      showDetails ? 'hide' : 'show'
                                    }`}
                                  >
                                    {showDetails
                                      ? showHideLabel()
                                      : showDetailsLabel()}
                                  </div>
                                  <div
                                    className={`form_details_text ${
                                      showDetails ? 'hide' : 'show'
                                    }`}
                                    hidden={!showDetails}
                                  >
                                    <Field
                                      as='textarea'
                                      className='-sm-details'
                                      disabled
                                      label='Transaction Details (Estimate)'
                                      name='txFeeEstimate'
                                      render={FetherForm.Field}
                                      placeholder={renderDetails(values)}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}

                          <OnChange name='gasPrice'>
                            {(value, previous) => {
                              if (this.state.maxSelected) {
                                mutators.recalculateMax();
                              }
                            }}
                          </OnChange>

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
      if (this.state.maxSelected) {
        return { amount: 'ETH balance too low to pay for gas.' };
      }
      return { amount: 'Please enter a non-zero amount' };
    } else if (amountBn.isNegative()) {
      return { amount: 'Please enter a positive amount' };
    } else if (token.address === 'ETH' && toWei(values.amount).lt(1)) {
      return { amount: 'Please enter at least 1 Wei' };
    } else if (amountBn.dp() > token.decimals) {
      return {
        amount: `Please enter a ${token.name} value of less than ${
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

      // If the gas hasn't been calculated yet, then we don't show any errors,
      // just wait a bit more
      if (!values.gas) {
        return;
      }

      if (!ethBalance || isNaN(values.gas)) {
        throw new Error('No "ethBalance" or "gas" value.');
      }

      if (!values.gas) {
        return;
      }

      const estimatedTxFee = values.gas.multipliedBy(
        toWei(values.gasPrice, 'shannon')
      );

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        estimatedTxFee
          .plus(token.address === 'ETH' ? toWei(values.amount) : 0)
          .gt(toWei(ethBalance))
      ) {
        !this.isCancelled &&
          this.setState({ estimatedTxFee: new BigNumber('0') });

        return token.address !== 'ETH'
          ? { amount: 'ETH balance too low to pay for gas' }
          : { amount: "You don't have enough ETH balance" };
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
