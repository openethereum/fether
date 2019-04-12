// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { chainId$, transactionCountOf$ } from '@parity/light.js';
import { Clickable, Form as FetherForm, Header } from 'fether-ui';
import createDecorator from 'final-form-calculate';
import debounce from 'debounce-promise';
import { Field, Form } from 'react-final-form';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import light from '@parity/light.js-react';
import { Link } from 'react-router-dom';
import { OnChange } from 'react-final-form-listeners';
import { startWith } from 'rxjs/operators';
import { withProps } from 'recompose';

import Debug from '../../utils/debug';
import { estimateGas } from '../../utils/transaction';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import TxDetails from './TxDetails';
import {
  chainIdToString,
  isEtcChainId,
  isNotErc20TokenAddress
} from '../../utils/chain';
import withAccount from '../../utils/withAccount';
import withBalance, { withEthBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

const DEFAULT_AMOUNT_MAX_CHARS = 9;
const MEDIUM_AMOUNT_MAX_CHARS = 14;
const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

const debug = Debug('TxForm');

@inject('parityStore', 'sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@withAccount
@light({
  // We need to wait for 3 values that might take time:
  // - ethBalance: to check that we have enough balance to send amount+fees
  // It may be ETH or ETC corresponding to whether we are connected to the
  // 'foundation' or 'classic' chain.
  // - chainId & transactionCount: needed to construct the tx
  // For the three of them, we add the `startWith()` operator so that the UI is
  // not blocked while waiting for their first response.
  chainId: () => chainId$().pipe(startWith(undefined)),
  transactionCount: ({ account: { address } }) =>
    transactionCountOf$(address).pipe(startWith(undefined))
})
@withBalance // Balance of current token (can be ETH or ETC)
@withEthBalance // ETH or ETC balance
@observer
class TxForm extends Component {
  state = {
    maxSelected: false,
    showDetails: false
  };

  decorator = createDecorator({
    field: /to|amount/, // when the value of these fields change...
    updates: {
      // ...set field "gas"
      gas: async (value, allValues) => {
        const { parityStore, token } = this.props;
        let newGasEstimate = null;

        if (this.preValidate(allValues) === true) {
          try {
            newGasEstimate = await estimateGas(
              allValues,
              token,
              parityStore.api
            );
          } catch (error) {
            return new BigNumber(-1);
          }
        }

        return newGasEstimate;
      }
    }
  });

  changeAmountFontSize = amount => {
    const amountLen = amount.toString().length;
    if (amountLen > MEDIUM_AMOUNT_MAX_CHARS) {
      return '-resize-font-small'; // Resize to fit an amount as small as one Wei
    } else if (
      MEDIUM_AMOUNT_MAX_CHARS >= amountLen &&
      amountLen > DEFAULT_AMOUNT_MAX_CHARS
    ) {
      return '-resize-font-medium';
    }
    return '-resize-font-default';
  };

  calculateMax = (gas, gasPrice) => {
    const { token, balance } = this.props;
    const gasBn = gas ? new BigNumber(gas) : new BigNumber(21000);
    const gasPriceBn = new BigNumber(gasPrice);
    let output;

    if (isNotErc20TokenAddress(token.address)) {
      output = fromWei(
        toWei(balance).minus(gasBn.multipliedBy(toWei(gasPriceBn, 'shannon')))
      );
      output = output.isNegative() ? new BigNumber(0) : output;
    } else {
      output = balance;
    }
    return output;
  };

  isEstimatedTxFee = values => {
    if (
      values.amount &&
      values.gas &&
      values.gasPrice &&
      !isNaN(values.amount) &&
      !values.gas.isNaN() &&
      !isNaN(values.gasPrice)
    ) {
      return true;
    }

    return false;
  };

  estimatedTxFee = values => {
    if (!this.isEstimatedTxFee(values)) {
      return null;
    }

    return values.gas.multipliedBy(toWei(values.gasPrice, 'shannon'));
  };

  handleSubmit = values => {
    const {
      account: { address, type },
      history,
      sendStore,
      token
    } = this.props;

    sendStore.setTx({ ...values, token });

    if (type === 'signer') {
      history.push(`/send/${token.address}/from/${address}/txqrcode`);
    } else {
      history.push(`/send/${token.address}/from/${address}/unlock`);
    }
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

  showDetailsAnchor = () => {
    return (
      <span className='toggle-details'>
        <Clickable onClick={this.toggleDetails}>&darr; Details</Clickable>
      </span>
    );
  };

  showHideAnchor = () => {
    return (
      <span className='toggle-details'>
        <Clickable onClick={this.toggleDetails}>&uarr; Hide</Clickable>
      </span>
    );
  };

  toggleDetails = () => {
    const { showDetails } = this.state;

    this.setState({ showDetails: !showDetails });
  };

  render () {
    const {
      account: { address, type },
      chainId,
      ethBalance,
      sendStore: { tx },
      token,
      transactionCount
    } = this.props;

    const { showDetails } = this.state;

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${address}`} className='icon -back'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <TokenBalance
                decimals={6}
                drawers={[
                  <Form
                    decorators={[this.decorator]}
                    initialValues={{
                      chainId,
                      ethBalance,
                      from: address,
                      gasPrice: 4,
                      transactionCount,
                      ...tx
                    }}
                    keepDirtyOnReinitialize // Don't erase other fields when we get new initialValues
                    key='txForm'
                    mutators={{
                      recalculateMax: this.recalculateMax
                    }}
                    onSubmit={this.handleSubmit}
                    validate={this.validateForm}
                    render={({
                      errors,
                      handleSubmit,
                      valid,
                      validating,
                      values,
                      form: { mutators }
                    }) => (
                      <form className='send-form' onSubmit={handleSubmit}>
                        <fieldset className='form_fields'>
                          {/* Unfortunately, we need to set these hidden fields
                              for the 3 values that come from props, even
                              though they are already set in initialValues. */}
                          <Field name='chainId' render={this.renderNull} />
                          <Field name='ethBalance' render={this.renderNull} />
                          <Field
                            name='transactionCount'
                            render={this.renderNull}
                          />

                          <Field
                            as='textarea'
                            autoFocus
                            className='-sm'
                            label='To'
                            name='to'
                            placeholder='0x...'
                            required
                            render={FetherForm.Field}
                          />

                          <Field
                            className={`form_field_amount ${
                              !values.amount
                                ? '-resize-font-default'
                                : this.changeAmountFontSize(values.amount)
                            }`}
                            disabled={this.state.maxSelected}
                            formNoValidate
                            label='Amount'
                            name='amount'
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

                          <TxDetails
                            estimatedTxFee={this.estimatedTxFee(values)}
                            showDetails={showDetails}
                            token={token}
                            values={values}
                          />

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
                          <div className='form-details-buttons'>
                            {showDetails
                              ? this.showHideAnchor()
                              : this.showDetailsAnchor()}
                          </div>
                          <button
                            disabled={!valid || validating}
                            className='button'
                          >
                            {validating ||
                            errors.chainId ||
                            errors.ethBalance ||
                            errors.gas ||
                            errors.transactionCount
                              ? 'Checking...'
                              : type === 'signer'
                                ? 'Scan'
                                : 'Send'}
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
        </RequireHealthOverlay>
      </div>
    );
  }

  renderNull = () => null;

  /**
   * Prevalidate form on user's input. These validations are sync.
   */
  preValidate = values => {
    const { balance, chainId: currentChainIdBN, token } = this.props;

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
        return {
          amount: `${chainIdToString(
            currentChainIdBN
          )} balance too low to pay for gas.`
        };
      }
      return { amount: 'Please enter a non-zero amount' };
    } else if (amountBn.isNegative()) {
      return { amount: 'Please enter a positive amount' };
    } else if (
      isNotErc20TokenAddress(token.address) &&
      toWei(values.amount).lt(1)
    ) {
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
      return {
        to: `Please enter a valid Ethereum ${
          isEtcChainId(currentChainIdBN) ? 'Classic address' : 'address'
        }`
      };
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
      const { chainId: currentChainIdBN, token } = this.props;

      const preValidation = this.preValidate(values);

      // preValidate return an error if a field isn't valid
      if (preValidation !== true) {
        return preValidation;
      }

      // The 3 values below (`chainId`, `ethBalance`, and `transactionCount`)
      // come from props, and are passed into `values` via the form's
      // initialValues. As such, they don't have visible fields, so these
      // errors won't actually be shown on the UI.
      if (!values.chainId) {
        debug('Fetching chain ID');
        return { chainId: 'Fetching chain ID' };
      }

      if (!values.ethBalance) {
        debug('Fetching Ether balance');
        return { ethBalance: 'Fetching Ether balance' };
      }

      if (!values.transactionCount) {
        debug('Fetching transaction count for nonce');
        return { transactionCount: 'Fetching transaction count for nonce' };
      }

      if (values.gas && values.gas.eq(-1)) {
        debug('Unable to estimate gas...');
        // Show this error on the `amount` field
        return { amount: 'Unable to estimate gas...' };
      }

      if (!this.isEstimatedTxFee(values)) {
        debug('Estimating gas...');
        return { gas: 'Estimating gas...' };
      }

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        this.estimatedTxFee(values)
          .plus(
            isNotErc20TokenAddress(token.address) ? toWei(values.amount) : 0
          )
          .gt(toWei(values.ethBalance))
      ) {
        return isNotErc20TokenAddress(token.address)
          ? {
            amount: `${chainIdToString(
              currentChainIdBN
            )} balance too low to pay for gas`
          }
          : {
            amount: `You don't have enough ${chainIdToString(
              currentChainIdBN
            )} balance`
          };
      }

      debug('Transaction seems valid');
    } catch (err) {
      console.error(err);
      return {
        amount: 'Failed estimating balance, please try again'
      };
    }
  }, 1000);
}

export default TxForm;
