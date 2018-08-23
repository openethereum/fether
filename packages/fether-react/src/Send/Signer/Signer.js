// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Field, Form } from 'react-final-form';
import { Form as FetherForm, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { withProps } from 'recompose';

import { consumeTokens } from '../../contexts/TokensContext.js';
import TokenBalance from '../../Tokens/TokensList/TokenBalance';
import withAccount from '../../utils/withAccount.js';

@inject('sendStore')
@withAccount
@consumeTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@observer
class Signer extends Component {
  handleAccept = values => {
    const { accountAddress, history, sendStore, token } = this.props;

    return sendStore
      .send(token, values.password)
      .then(() =>
        history.push(`/send/${token.address}/from/${accountAddress}/sent`)
      )
      .catch(error => ({
        password: error.text
      }));
  };

  render () {
    const {
      accountAddress,
      history,
      sendStore: { tx },
      token
    } = this.props;

    if (!tx || !token) {
      return <Redirect to='/' />;
    }

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${accountAddress}`} className='icon -close'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <div className='window_content'>
          <div className='box -padded'>
            <TokenBalance
              drawers={[
                <div key='txForm'>
                  <FetherForm.Field
                    className='form_field_value'
                    disabled
                    defaultValue={`${tx.amount} ${token.symbol}`}
                    label='Amount'
                  />

                  <FetherForm.Field
                    as='textarea'
                    className='form_field_value'
                    disabled
                    defaultValue={tx.to}
                    label='To'
                  />
                </div>,
                <Form
                  key='signerForm'
                  onSubmit={this.handleAccept}
                  render={({ handleSubmit, pristine, submitting }) => (
                    <form onSubmit={handleSubmit}>
                      <div className='text'>
                        <p>Enter your password to confirm this transaction.</p>
                      </div>

                      <Field
                        label='Password'
                        name='password'
                        render={FetherForm.Field}
                        required
                        type='password'
                      />

                      <nav className='form-nav -binary'>
                        <button
                          className='button -cancel'
                          onClick={history.goBack}
                          type='button'
                        >
                          Cancel
                        </button>

                        <button
                          className='button -submit'
                          disabled={pristine || submitting}
                        >
                          Confirm transaction
                        </button>
                      </nav>
                    </form>
                  )}
                />
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

export default Signer;
