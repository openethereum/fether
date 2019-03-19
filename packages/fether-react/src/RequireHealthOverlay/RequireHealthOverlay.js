// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import i18n, { packageNS } from '../i18n';
import withHealth from '../utils/withHealth';
import { HealthModal } from './HealthModal';

function statusMatches (status, require) {
  switch (require) {
    // Connection to a node and internet connection are both required
    case 'node-internet':
      return status.nodeConnected && status.internet;
    // Connection to a node is required but internet is not necessary
    case 'node':
      return status.nodeConnected;
    // Synchronised connection with no issues is required
    case 'sync':
      return status.good;
    default:
      throw new Error(
        i18n.t(`${packageNS}:health.error_status_invalid`, { status })
      );
  }
}

@withHealth
class RequireHealthOverlay extends Component {
  static propTypes = {
    health: PropTypes.object,
    require: PropTypes.oneOf(['node-internet', 'node', 'sync']),
    fullscreen: PropTypes.bool
  };

  state = {
    visible: false
  };

  componentDidMount () {
    this.updateVisibility();
  }

  componentDidUpdate () {
    this.updateVisibility();
  }

  updateVisibility = () => {
    const {
      health: { status },
      require
    } = this.props;

    if (statusMatches(status, require)) {
      if (this.state.visible !== false) {
        this.setState({ visible: false });
      }
    } else {
      if (this.state.visible === false) {
        this.setState({ visible: true });
      }
    }
  };

  render () {
    const { visible } = this.state;
    const { children, fullscreen } = this.props;

    return (
      <HealthModal fullscreen={fullscreen} visible={visible}>
        {children}
      </HealthModal>
    );
  }
}

export default RequireHealthOverlay;
