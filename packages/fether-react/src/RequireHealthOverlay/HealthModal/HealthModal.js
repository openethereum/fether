// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { chainName$, isLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Modal } from 'fether-ui';

@light({
  chainName: chainName$
})
class HealthModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    fullscreen: PropTypes.bool,
    loading: PropTypes.any.isRequired,
    payload: PropTypes.object,
    status: PropTypes.object,
    visible: PropTypes.bool
  };

  render () {
    const { children, fullscreen, loading, visible } = this.props;

    return (
      <Modal
        description={this.renderDescription()}
        fullscreen={fullscreen}
        loading={loading}
        title={this.renderTitle()}
        visible={visible}
      >
        {children}
      </Modal>
    );
  }

  renderTitle = () => {
    const { status } = this.props;

    if (!status.nodeConnected && !status.internet) {
      return 'No internet. No node connected';
    } else if (status.downloading) {
      return 'Downloading Parity Ethereum...';
    } else if (status.launching) {
      return 'Launching the node...';
    } else if (status.nodeConnected && !status.internet) {
      return 'No internet. Connected to node';
    } else if (!status.clockSync) {
      return 'Clock of host not in sync';
    } else if (!status.peers) {
      return 'No peer node connections';
    } else if (status.syncing) {
      return `Syncing...`;
    } else {
      return '';
    }
  };

  renderDescription = () => {
    const { chainName, payload, status } = this.props;

    const chainNameAppend = isLoading(chainName) ? '' : ` (${chainName})`;

    if (!status.internet) {
      return 'Please connect to the Internet';
    } else if (!status.clockSync) {
      return `Mac: System Preferences -> Date & Time -> Uncheck and recheck "Set date and time automatically"
      Windows: Control Panel -> "Clock, Language, and Region" -> "Date and Time" -> Uncheck and recheck "Set date and time automatically"`;
    } else if (!status.peers) {
      return 'Searching for peers';
    } else if (status.syncing) {
      return `Syncing...${
        payload &&
        payload.downloading &&
        payload.downloading.syncPercentage &&
        payload.downloading.syncPercentage.gt(0)
          ? ` (${payload.downloading.syncPercentage.toFixed(0)}%)`
          : ''
      }${chainNameAppend}`;
    } else {
      return '';
    }
  };
}

export { HealthModal };
