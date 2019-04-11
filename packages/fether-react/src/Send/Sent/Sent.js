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

import i18n, { packageNS } from '../../i18n';
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
      return i18n.t(`${packageNS}:tx.sent.waiting_confirmations_receiving`, {
        progress: `${confirmations}/${MIN_CONFIRMATIONS}`
      });
    }

    if (txStatus.confirmed) {
      return i18n.t(`${packageNS}:tx.sent.waiting_confirmed`);
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
            ? i18n.t(`${packageNS}:tx.sent.confirmed`)
            : i18n.t(`${packageNS}:tx.sent.submitted`)}
        </span>
      );
    }

    if (txStatus.failed) {
      return i18n.t(`${packageNS}:tx.sent.error`);
    }

    return i18n.t(`${packageNS}:tx.header_sending`);
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
          {i18n.t(`${packageNS}:navigation.go_back`)}
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
            txStatus.confirmed.hash,
            token.address
          )}
          target='_blank'
          rel='noopener noreferrer'
        >
          <button className='button -tiny'>
            {i18n.t(`${packageNS}:tx.blockscout`)}
          </button>
        </a>
      );
    }

    return null;
  };
}

export default Sent;
