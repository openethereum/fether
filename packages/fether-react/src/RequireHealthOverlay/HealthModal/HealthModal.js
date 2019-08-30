// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'recompose';
import { chainName$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Modal } from 'fether-ui';

import i18n, { packageNS } from '../../i18n';
import loading from '../../assets/img/icons/loading.svg';
import * as postMessage from '../../utils/postMessage';
import withHealth from '../../utils/withHealth';

// Timeout to wait to restart parity-ethereum light client, if the node is not
// reachable
const RESTART_NODE_TIMEOUT = 15 * 1000;

@withHealth
@branch(
  ({
    health: {
      status: { syncing }
    }
  }) => syncing,
  // Only call light.js chainName$ if we're syncing
  light({
    chainName: () => chainName$()
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

  // Timeout to restart parity node
  restartNodeTimeout = undefined;

  componentDidUpdate () {
    const {
      health: { status }
    } = this.props;

    // Clear timeout each time we have a new health status
    if (this.restartNodeTimeout) {
      clearTimeout(this.restartNodeTimeout);
      this.restartNodeTimeout = undefined;
    }

    // If we have internet, but node is not connected, then we wait for 15s, and
    //
    if (!status.nodeConnected) {
      this.restartNodeTimeout = setTimeout(() => {
        postMessage.send('RESTART_NODE_REQUEST');
      }, RESTART_NODE_TIMEOUT);
    }
  }

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

    if (!status.nodeConnected && !status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.no_internet_no_node_connected`
      );
    } else if (!status.nodeConnected && status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.internet_no_node_connected`
      );
    } else if (status.nodeConnected && !status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.no_internet_node_connected`
      );
    } else if (!status.clockSync) {
      return i18n.t(`${packageNS}:health.status.title.no_clock_sync`);
    } else if (!status.peers) {
      return i18n.t(`${packageNS}:health.status.title.no_peers`);
    } else if (status.syncing) {
      return i18n.t(`${packageNS}:health.status.title.syncing`);
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
      return i18n.t(`${packageNS}:health.status.description.no_internet`);
    } else if (!status.clockSync) {
      return i18n.t(`${packageNS}:health.status.description.no_clock_sync`);
    } else if (!status.peers) {
      return i18n.t(`${packageNS}:health.status.description.no_peers`);
    } else if (status.syncing) {
      return `${i18n.t(`${packageNS}:health.status.description.syncing`)} ${
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
