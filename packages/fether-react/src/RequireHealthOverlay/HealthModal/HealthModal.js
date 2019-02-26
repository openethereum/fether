// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'recompose';
import { chainName$, withoutLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Modal } from 'fether-ui';

import i18n from '../../i18n';
import withHealth from '../../utils/withHealth';
import loading from '../../assets/img/icons/loading.svg';

@withHealth
@branch(
  ({
    health: {
      status: { syncing }
    }
  }) => syncing,
  // Only call light.js chainName$ if we're syncing
  light({
    chainName: () => chainName$().pipe(withoutLoading())
  })
)
class HealthModal extends Component {
  static propTypes = {
    chainName: PropTypes.string,
    children: PropTypes.node,
    fullscreen: PropTypes.bool,
    health: PropTypes.object,
    visible: PropTypes.bool
  };

  render () {
    const { children, fullscreen, visible } = this.props;

    return (
      <Modal
        description={this.renderDescription()}
        fullscreen={fullscreen}
        icon={loading}
        title={this.renderTitle()}
        visible={visible}
      >
        {children}
      </Modal>
    );
  }

  renderTitle = () => {
    const {
      health: { status }
    } = this.props;

    if (status.downloading) {
      return i18n.t('ns1:health.status.title.downloading');
    } else if (status.launching) {
      return i18n.t('ns1:health.status.title.launching');
    } else if (!status.nodeConnected && !status.internet) {
      return i18n.t('ns1:health.status.title.no_internet_no_node_connected');
    } else if (!status.nodeConnected && status.internet) {
      return i18n.t('ns1:health.status.title.internet_no_node_connected');
    } else if (status.nodeConnected && !status.internet) {
      return i18n.t('ns1:health.status.title.no_internet_node_connected');
    } else if (!status.clockSync) {
      return i18n.t('ns1:health.status.title.no_clock_sync');
    } else if (!status.peers) {
      return i18n.t('ns1:health.status.title.no_peers');
    } else if (status.syncing) {
      return i18n.t('ns1:health.status.title.syncing');
    } else {
      return '';
    }
  };

  renderDescription = () => {
    const {
      chainName,
      health: { payload, status }
    } = this.props;

    if (!status.internet) {
      return i18n.t('ns1:health.status.description.no_internet');
    } else if (status.downloading) {
      return `${i18n.t('ns1:health.status.description.downloading')} (${
        payload.downloading.syncPercentage
      }%)`;
    } else if (!status.clockSync) {
      return i18n.t('ns1:health.status.description.no_clock_sync');
    } else if (!status.peers) {
      return i18n.t('ns1:health.status.description.no_peers');
    } else if (status.syncing) {
      return `${i18n.t('ns1:health.status.description.syncing')} ${
        payload &&
        payload.syncing &&
        payload.syncing.syncPercentage &&
        payload.syncing.syncPercentage.gt(0)
          ? ` (${payload.syncing.syncPercentage.toFixed(0)}%)`
          : ''
      } ${chainName}`;
    } else {
      return '';
    }
  };
}

export { HealthModal };
