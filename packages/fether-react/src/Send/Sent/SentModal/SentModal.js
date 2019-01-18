// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'fether-ui';

// Number of confirmations to consider a transaction successful
const MIN_CONFIRMATIONS = 6;

class SentModal extends Component {
  static propTypes = {
    blockscoutTxUrl: PropTypes.func,
    chainName: PropTypes.string,
    check: PropTypes.any.isRequired,
    confirmationsCount: PropTypes.number,
    handleGoHomepage: PropTypes.func,
    loading: PropTypes.any.isRequired,
    token: PropTypes.object,
    txStatus: PropTypes.object
  };

  render () {
    return (
      <Modal
        description={this.renderDescription()}
        fullscreen
        link={this.renderLink()}
        loading={this.renderIcon()}
        navigateTo={this.renderGoHomepage()}
        title={this.renderTitle()}
        visible
      />
    );
  }

  renderDescription = () => {
    const { confirmationsCount, txStatus } = this.props;

    if (!txStatus) {
      return '';
    }

    if (confirmationsCount >= MIN_CONFIRMATIONS) {
      return null;
    }

    if (confirmationsCount > 0) {
      return `Waiting ${confirmationsCount}/${MIN_CONFIRMATIONS} confirmations`;
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
    const { check, confirmationsCount, loading } = this.props;

    if (confirmationsCount >= MIN_CONFIRMATIONS) {
      return check;
    }

    return loading;
  };

  renderTitle = () => {
    const { confirmationsCount, txStatus } = this.props;

    if (!txStatus) {
      return '';
    }

    if (txStatus.confirmed) {
      return (
        <span>
          {confirmationsCount >= MIN_CONFIRMATIONS
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
    const { confirmationsCount, handleGoToHomepage } = this.props;

    if (confirmationsCount < MIN_CONFIRMATIONS) {
      return;
    }

    return (
      <nav className='form-nav'>
        <button
          className='button'
          disabled={confirmationsCount < MIN_CONFIRMATIONS}
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
      confirmationsCount,
      txStatus,
      token
    } = this.props;

    if (confirmationsCount >= 0) {
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
