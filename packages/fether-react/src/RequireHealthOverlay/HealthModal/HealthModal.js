// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'recompose';
import { chainName$, withoutLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Modal } from 'fether-ui';

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
      return 'Downloading Parity Ethereum...';
    } else if (status.launching) {
      return 'Launching the node...';
    } else if (!status.nodeConnected && !status.internet) {
      return 'No internet. No node connected';
    } else if (!status.nodeConnected && status.internet) {
      return 'Connecting to node...';
    } else if (status.nodeConnected && !status.internet) {
      return 'No internet. Connected to node';
    } else if (!status.clockSync) {
      return 'Clock of host not in sync';
    } else if (!status.peers) {
      return 'Connecting to peers...';
    } else if (status.syncing) {
      return `Syncing...`;
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
      return 'Please connect to the Internet';
    } else if (status.downloading) {
      return `Downloading Parity Ethereum... (${
        payload.downloading.syncPercentage
      }%)`;
    } else if (!status.clockSync) {
      return `Mac: System Preferences -> Date & Time -> Uncheck and recheck "Set date and time automatically"
      Windows: Control Panel -> "Clock, Language, and Region" -> "Date and Time" -> Uncheck and recheck "Set date and time automatically"`;
    } else if (!status.peers) {
      return 'Searching for peers';
    } else if (status.syncing) {
      return `Syncing...${
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
