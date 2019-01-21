// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Field, Form } from 'react-final-form';
import { Form as FetherForm, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';

import RequireHealth from '../../RequireHealthOverlay';
import TokenAddress from '../../Tokens/TokensList/TokenAddress';
import withAccount from '../../utils/withAccount';
import withBalance, { withEthBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

@inject('parityStore', 'sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@withAccount
@withBalance // Balance of current token (can be ETH)
@withEthBalance // ETH balance
@observer
class SignedTxSummary extends Component {
  handleSubmit = values => {
    const {
      account: { address },
      history,
      sendStore,
      token
    } = this.props;

    return sendStore
      .sendRaw()
      .then(() => history.push(`/send/${token.address}/from/${address}/sent`))
      .catch(error => ({
        password: error.text
      }));
  };

  render () {
    const {
      account: { address },
      sendStore: { tx },
      token
    } = this.props;

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

        <RequireHealth require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <TokenAddress
                copyAddress
                decimals={6}
                drawers={[
                  <Form
                    key='txForm'
                    initialValues={{
                      from: address,
                      to: tx.to,
                      amount: tx.amount,
                      ...tx
                    }}
                    onSubmit={this.handleSubmit}
                    render={({ handleSubmit, values }) => (
                      <form className='send-form' onSubmit={handleSubmit}>
                        <fieldset className='form_fields'>
                          <Field
                            className='form_field_amount'
                            disabled
                            label='Amount'
                            name='amount'
                            render={FetherForm.Field}
                            type='number'
                          />

                          <Field
                            as='textarea'
                            className='-sm'
                            disabled
                            label='To'
                            name='to'
                            render={FetherForm.Field}
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
                          <button className='button'>Send</button>
                        </nav>
                      </form>
                    )}
                  />
                ]}
                onClick={null} // To disable cursor:pointer on card // TODO Can this be done better?
                shortAddress={false}
                token={token}
              />
            </div>
          </div>
        </RequireHealth>
      </div>
    );
  }
}

export default SignedTxSummary;
