// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import debounce from 'debounce-promise';
import { estimateGas } from '../../utils/estimateGas';
import { Field, Form } from 'react-final-form';
import { Form as FetherForm, Header } from 'fether-ui';
import { toWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { isAddress } from '@parity/api/lib/util/address';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withBalance, { withEthBalance } from '../../utils/withBalance';

const MAX_GAS_PRICE = 40; // In Gwei
const MIN_GAS_PRICE = 3; // Safelow gas price from GasStation, in Gwei

@inject('parityStore', 'sendStore', 'tokensStore')
@withProps(({ match: { params: { tokenAddress } }, tokensStore }) => ({
  token: tokensStore.tokens[tokenAddress]
}))
@withBalance // Balance of current token (can be ETH)
@withEthBalance // ETH balance
@observer
class Send extends Component {
  handleSubmit = values => {
    const { history, sendStore, token } = this.props;
    sendStore.setTx(values);
    history.push(`/send/${token.address}/signer`);
  };

  render () {
    const {
      sendStore: { tx },
      token
    } = this.props;

    return (
      <div>
        <Header
          left={
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <div className='window_content'>
          <div className='box -padded'>
            <TokenBalance
              decimals={6}
              drawers={[
                <Form
                  key='txForm'
                  initialValues={{ gasPrice: 4, ...tx }}
                  onSubmit={this.handleSubmit}
                  validate={this.validateForm}
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
      </div>
    );
  }

  /**
   * Estimate gas amount, and validate that the user has enough balance to make
   * the tx.
   */
  validateAmount = debounce(async values => {
    try {
      const { balance, ethBalance, parityStore, token } = this.props;
      const amount = +values.amount;

      if (!amount || isNaN(amount)) {
        return { amount: 'Please enter a valid amount' };
      } else if (amount < 0) {
        return { amount: 'Please enter a positive amount ' };
      } else if (balance && balance.lt(amount)) {
        return { amount: `You don't have enough ${token.symbol} balance` };
      }

      const estimated = await estimateGas(values, token, parityStore.api);

      if (!ethBalance || isNaN(estimated)) {
        throw new Error('No "ethBalance" or "estimated" value.');
      }

      // Verify that `gas + (eth amount if sending eth) <= ethBalance`
      if (
        estimated
          .mul(toWei(values.gasPrice, 'shannon'))
          .plus(token.address === 'ETH' ? toWei(values.amount) : 0)
          .gt(toWei(ethBalance))
      ) {
        return { amount: "You don't have enough ETH balance" };
      }
    } catch (err) {
      return {
        amount: 'Failed estimating balance, please try again'
      };
    }
  }, 1000);

  validateForm = values => {
    const errors = {};
    if (!isAddress(values.to)) {
      errors.to = 'Please enter a valid Ethereum address';
    }

    return Object.keys(errors).length ? errors : this.validateAmount(values);
  };
}

export default Send;
