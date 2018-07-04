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

import TokenBalance from '../../Tokens/TokensList/TokenBalance';

@inject('sendStore', 'tokensStore')
@withProps(({ match: { params: { tokenAddress } }, tokensStore }) => ({
  token: tokensStore.tokens[tokenAddress]
}))
@observer
class Signer extends Component {
  state = {
    error: null,
    isSending: false,
    password: ''
  };

  handleAccept = event => {
    const { history, sendStore, token } = this.props;
    const { password } = this.state;

    event.preventDefault();

    this.setState({ isSending: true }, () => {
      sendStore
        .send(password)
        .then(() => history.push(`/send/${token.address}/sent`))
        .catch(error => {
          this.setState({ error, isSending: false });
        });
    });
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ error: null, password: value });
  };

  render () {
    const {
      history,
      sendStore: { tx },
      token
    } = this.props;

    if (!tx || !token) {
      return <Redirect to={`/`} />;
    }

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
              drawers={[
                <div key='txForm'>
                  <div className='form_field'>
                    <label>Amount</label>
                    <div className='form_field_value'>
                      {tx.amount} {token.symbol}
                    </div>
                  </div>
                  <div className='form_field'>
                    <label>To</label>
                    <div className='form_field_value'>{tx.to}</div>
                  </div>
                </div>,
                <Form
                  key='signerForm'
                  onSubmit={this.handleAccept}
                  render={({ handleSubmit, submitting, valid }) => (
                    <form onSubmit={handleSubmit}>
                      <div className='text'>
                        <p>Enter your password to confirm this transaction.</p>
                      </div>

                      <Field
                        label='Password'
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
                          disabled={!valid || submitting}
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
