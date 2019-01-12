// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '../Modal';

class SentModal extends Component {
  static propTypes = {
    blockscoutTxUrl: PropTypes.func,
    chainName: PropTypes.string,
    check: PropTypes.any.isRequired,
    handleGoHomepage: PropTypes.func,
    loading: PropTypes.any.isRequired,
    minConfirmations: PropTypes.number,
    token: PropTypes.object
  };

  render () {
    return (
      <Modal
        description={this.renderDescription()}
        fullscreen
        loading={this.renderIcon()}
        navigateTo={this.renderGoHomepage()}
        title={this.renderTitle()}
        visible
      />
    );
  }

  renderDescription = () => {
    const {
      minConfirmations: MIN_CONFIRMATIONS,
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
      check,
      loading,
      minConfirmations: MIN_CONFIRMATIONS,
      sendStore: { confirmations }
    } = this.props;

    if (confirmations >= MIN_CONFIRMATIONS) {
      return check;
    }

    return loading;
  };

  renderTitle = () => {
    const {
      minConfirmations: MIN_CONFIRMATIONS,
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
      handleGoToHomepage,
      minConfirmations: MIN_CONFIRMATIONS,
      sendStore: { confirmations }
    } = this.props;

    if (confirmations < MIN_CONFIRMATIONS) {
      return;
    }

    return (
      <nav className='form-nav'>
        <button
          className='button'
          disabled={confirmations < 6}
          onClick={handleGoToHomepage}
        >
          Go back
        </button>
      </nav>
    );
  };

  renderLink = () => {
    const {
      blockscoutTxUrl,
      chainName,
      sendStore: { confirmations, txStatus },
      token
    } = this.props;

    if (confirmations >= 0) {
      return (
        <a
          href={blockscoutTxUrl(
            chainName,
            txStatus.confirmed.transactionHash,
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

export { SentModal };
