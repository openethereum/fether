// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { FormField, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import TokenBalance from '../../Tokens/TokensList/TokenBalance';

@inject('sendStore')
@observer
class Signer extends Component {
  state = {
    error: null,
    isSending: false,
    password: ''
  };

  handleAccept = event => {
    const { history, sendStore } = this.props;
    const { password } = this.state;

    event.preventDefault();

    this.setState({ isSending: true }, () => {
      sendStore
        .acceptRequest(password)
        .then(() => history.push('/send/sent'))
        .catch(error => {
          this.setState({ error, isSending: false }, () =>
            ReactTooltip.show(findDOMNode(this.tooltip))
          );
        });
    });
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ error: null, password: value });
  };

  handleReject = () => {
    const { history, sendStore } = this.props;

    this.setState({ isSending: true }, () => {
      sendStore
        .rejectRequest()
        .then(() => history.goBack())
        .catch(() => history.goBack());
    });
  };

  handleTooltipRef = ref => {
    this.tooltip = ref;
  };

  render () {
    const {
      sendStore: { token, tx, txStatus }
    } = this.props;
    const { error, isSending, password } = this.state;

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
                <form key='signerForm' onSubmit={this.handleAccept}>
                  <div className='text'>
                    <p>Enter your password to confirm this transaction.</p>
                  </div>

                  <div
                    data-tip={error ? error.text : ''}
                    ref={this.handleTooltipRef}
                  >
                    <FormField
                      label='Password'
                      onChange={this.handleChangePassword}
                      required
                      type='password'
                      value={password}
                    />
                  </div>

                  <nav className='form-nav -binary'>
                    <button
                      className='button -cancel'
                      onClick={this.handleReject}
                      type='button'
                    >
                      Cancel
                    </button>

                    <button
                      className='button -submit'
                      disabled={
                        !txStatus || !txStatus.requested || isSending || error
                      }
                    >
                      Confirm transaction
                    </button>
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
          eventOff='keydown mouseout'
          place='top'
        />
      </div>
    );
  }
}

export default Signer;
