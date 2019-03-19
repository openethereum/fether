// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { Clickable, Form as FetherForm, Header } from 'fether-ui';
import createDecorator from 'final-form-calculate';
import { chainId$, withoutLoading } from '@parity/light.js';
import debounce from 'debounce-promise';
import { Field, Form } from 'react-final-form';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import light from '@parity/light.js-react';
import { Link } from 'react-router-dom';
import { OnChange } from 'react-final-form-listeners';
import { withProps } from 'recompose';

import i18n, { packageNS } from '../../i18n';
import { estimateGas } from '../../utils/transaction';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import TxDetails from './TxDetails';
import withAccount from '../../utils/withAccount';
import withBalance, { withEthBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

const DEFAULT_AMOUNT_MAX_CHARS = 9;
const MEDIUM_AMOUNT_MAX_CHARS = 14;
const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

@inject('parityStore', 'sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@withAccount
@light({
  chainId: () => chainId$().pipe(withoutLoading())
})
@withBalance // Balance of current token (can be ETH)
@withEthBalance // ETH balance
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
            console.error(error);
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
      account: { address, type, transactionCount },
      chainId,
      history,
      sendStore,
      token
    } = this.props;

    sendStore.setTx({ ...values, chainId, token, transactionCount });

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
        <Clickable onClick={this.toggleDetails}>
          &darr; {i18n.t(`${packageNS}:tx.form.details.details`)}
        </Clickable>
      </span>
    );
  };

  showHideAnchor = () => {
    return (
      <span className='toggle-details'>
        <Clickable onClick={this.toggleDetails}>
          &uarr; {i18n.t(`${packageNS}:tx.form.details.hide`)}
        </Clickable>
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
      sendStore: { tx },
      token
    } = this.props;

    const { showDetails } = this.state;

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${address}`} className='icon -back'>
              {i18n.t(`${packageNS}:navigation.close`)}
            </Link>
          }
          title={
            token && (
              <h1>
                {i18n.t(`${packageNS}:tx.header_send_prefix`, {
                  token: token.name
                })}
              </h1>
            )
          }
        />

        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <TokenBalance
                decimals={6}
                drawers={[
                  <Form
                    key='txForm'
                    initialValues={{ from: address, gasPrice: 4, ...tx }}
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
                      <form
                        className='send-form'
                        noValidate
                        onSubmit={handleSubmit}
                      >
                        <fieldset className='form_fields'>
                          <Field
                            as='textarea'
                            autoFocus
                            className='-sm'
                            label={i18n.t(`${packageNS}:tx.form.field.to`)}
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
                            label={i18n.t(`${packageNS}:tx.form.field.amount`)}
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
                              {i18n.t(`${packageNS}:tx.form.button_max`)}
                            </button>
                          </Field>

                          <Field
                            centerText={`${values.gasPrice} GWEI`}
                            className='-range'
                            label={i18n.t(
                              `${packageNS}:tx.form.field.tx_speed`
                            )}
                            leftText={i18n.t(`${packageNS}:tx.form.field.low`)}
                            max={MAX_GAS_PRICE}
                            min={MIN_GAS_PRICE}
                            name='gasPrice'
                            render={FetherForm.Slider}
                            required
                            rightText={i18n.t(
                              `${packageNS}:tx.form.field.high`
                            )}
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
                              <h3>
                                {i18n.t(
                                  `${packageNS}:tx.form.warning.title_same_sender_receiver`
                                )}
                              </h3>
                              <p>
                                {i18n.t(
                                  `${packageNS}:tx.form.warning.body_same_sender_receiver`
                                )}
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
                            {validating
                              ? i18n.t(`${packageNS}:tx.form.button_checking`)
                              : type === 'signer'
                                ? i18n.t(`${packageNS}:tx.form.button_scan`)
                                : i18n.t(`${packageNS}:tx.form.button_send`)}
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

  preValidate = values => {
    const { balance, token } = this.props;

    if (!values) {
      return;
    }

    if (!values.amount) {
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.amount_invalid`)
      };
    }

    const amountBn = new BigNumber(values.amount.toString());

    if (amountBn.isNaN()) {
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.amount_invalid`)
      };
    } else if (amountBn.isZero()) {
      if (this.state.maxSelected) {
        return {
          amount: i18n.t(
            `${packageNS}:tx.form.validation.alert.eth_balance_too_low_for_gas`
          )
        };
      }
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.non_zero_amount`)
      };
    } else if (amountBn.isNegative()) {
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.positive_amount`)
      };
    } else if (token.address === 'ETH' && toWei(values.amount).lt(1)) {
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.min_wei`)
      };
    } else if (amountBn.dp() > token.decimals) {
      return {
        amount: i18n.t(`${packageNS}:tx.form.validation.alert.min_decimals`, {
          token_name: token.name,
          token_decimals: token.decimals
        })
      };
    } else if (balance && balance.lt(amountBn)) {
      return {
        amount: i18n.t(
          `${packageNS}:tx.form.validation.alert.token_balance_too_low`,
          {
            token_symbol: token.symbol
          }
        )
      };
    } else if (!values.to || !isAddress(values.to)) {
      return {
        to: i18n.t(`${packageNS}:tx.form.validation.alert.invalid_eth_address`)
      };
    } else if (values.to === '0x0000000000000000000000000000000000000000') {
      return {
        to: i18n.t(
          `${packageNS}:tx.form.validation.alert.prevent_send_zero_account`,
          {
            token_name: token.name
          }
        )
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
      const {
        account: { address, transactionCount },
        chainId,
        ethBalance,
        token
      } = this.props;

      if (!chainId) {
        throw new Error(
          i18n.t(`${packageNS}:tx.form.validation.throw.no_chain_id`)
        );
      }

      if (!address) {
        throw new Error(
          i18n.t(`${packageNS}:tx.form.validation.throw.no_address`)
        );
      }

      if (!transactionCount) {
        throw new Error(
          i18n.t(`${packageNS}:tx.form.validation.throw.no_tx_count`)
        );
      }

      if (!token || !token.address || !token.decimals) {
        throw new Error(
          i18n.t(`${packageNS}:tx.form.validation.throw.no_token_info`)
        );
      }

      if (!ethBalance) {
        throw new Error(
          i18n.t(`${packageNS}:tx.form.validation.throw.no_eth_balance`)
        );
      }

      const preValidation = this.preValidate(values);

      // preValidate return an error if a field isn't valid
      if (preValidation !== true) {
        return preValidation;
      }

      if (values.gas && values.gas.eq(-1)) {
        return {
          amount: i18n.t(
            `${packageNS}:tx.form.validation.alert.unable_estimate_gas`
          )
        };
      }

      // If the gas hasn't been calculated yet, then we don't show any errors,
      // just wait a bit more
      if (!this.isEstimatedTxFee(values)) {
        return {
          amount: i18n.t(`${packageNS}:tx.form.validation.alert.estimating_gas`)
        };
      }

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        this.estimatedTxFee(values)
          .plus(token.address === 'ETH' ? toWei(values.amount) : 0)
          .gt(toWei(ethBalance))
      ) {
        return token.address !== 'ETH'
          ? {
            amount: i18n.t(
              `${packageNS}:tx.form.validation.alert.eth_balance_too_low_for_gas`
            )
          }
          : {
            amount: i18n.t(
              `${packageNS}:tx.form.validation.alert.eth_balance_too_low`
            )
          };
      }
    } catch (err) {
      console.error(err);
      return {
        amount: i18n.t(
          `${packageNS}:tx.form.validation.alert.error_estimating_balance`
        )
      };
    }
  }, 1000);
}

export default TxForm;
