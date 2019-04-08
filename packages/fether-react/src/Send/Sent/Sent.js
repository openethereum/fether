// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { chainName$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import { withProps } from 'recompose';
import { Modal } from 'fether-ui';

import RequireHealthOverlay from '../../RequireHealthOverlay';
import check from '../../assets/img/icons/check.svg';
import loading from '../../assets/img/icons/loading.svg';
import withTokens from '../../utils/withTokens';
import { blockscoutTxUrl } from '../../utils/blockscout';

// Number of confirmations to consider a transaction successful
const MIN_CONFIRMATIONS = 6;

@light({
  chainName: () => chainName$()
})
@inject('sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@observer
class Sent extends Component {
  static propTypes = {
    chainName: PropTypes.string,
    sendStore: PropTypes.object,
    token: PropTypes.object
  };

  componentWillMount () {
    // If we refresh on this page, return to homepage
    if (!this.props.sendStore.txStatus) {
      this.handleGoToHomepage();
    }
  }

  handleGoToHomepage = () => {
    const { history, sendStore } = this.props;
    sendStore.clear();
    history.push('/');
  };

  render () {
    return (
      <RequireHealthOverlay require='node-internet' fullscreen>
        <div className='window_content'>
          <Modal
            description={this.renderDescription()}
            fullscreen
            link={this.renderLink()}
            icon={this.renderIcon()}
            buttons={this.renderGoHomepage()}
            title={this.renderTitle()}
            visible
          />
        </div>
      </RequireHealthOverlay>
    );
  }

  renderDescription = () => {
    const {
      sendStore: { confirmations, txStatus }
    } = this.props;

    if (!txStatus) {
      return '';
    }

    if (confirmations >= MIN_CONFIRMATIONS) {
      return null;
    }

    if (confirmations > 0) {
      return `Waiting ${confirmations}/${MIN_CONFIRMATIONS} confirmations`;
    }

    if (txStatus.confirmed) {
      return 'Waiting for confirmations...';
    }

    if (txStatus.failed) {
      return JSON.stringify(txStatus.failed);
    }

    return null;
  };

  renderIcon = () => {
    const {
      sendStore: { confirmations }
    } = this.props;

    if (confirmations >= MIN_CONFIRMATIONS) {
      return check;
    }

    return loading;
  };

  renderTitle = () => {
    const {
      sendStore: { confirmations, txStatus }
    } = this.props;

    if (!txStatus) {
      return '';
    }

    if (txStatus.confirmed) {
      return (
        <span>
          {confirmations >= MIN_CONFIRMATIONS
            ? 'Transaction confirmed'
            : 'Submitted'}
        </span>
      );
    }

    if (txStatus.failed) {
      return 'Error';
    }

    return 'Sending your transaction...';
  };

  renderGoHomepage = () => {
    const {
      sendStore: { confirmations }
    } = this.props;

    if (confirmations < MIN_CONFIRMATIONS) {
      return;
    }

    return (
      <nav className='form-nav'>
        <button
          className='button'
          disabled={confirmations < MIN_CONFIRMATIONS}
          onClick={this.handleGoToHomepage}
        >
          Go back
        </button>
      </nav>
    );
  };

  renderLink = () => {
    const {
      chainName,
      sendStore: { confirmations, txStatus },
      token
    } = this.props;

    if (txStatus && txStatus.confirmed && confirmations >= 0) {
      return (
        <a
          href={blockscoutTxUrl(
            chainName,
            txStatus.confirmed.blockHash,
            token.address
          )}
          target='_blank'
          rel='noopener noreferrer'
        >
          <button className='button -tiny'>See it on BlockScout</button>
        </a>
      );
    }

    return null;
  };
}

export default Sent;
