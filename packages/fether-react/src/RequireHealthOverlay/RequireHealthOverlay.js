// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withHealth from '../utils/withHealth';
import loading from '../assets/img/icons/loading.svg';
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
        `Status '${status}' must be one of 'node-internet|node|sync'.`
      );
  }
}

@withHealth
class RequireHealthOverlay extends Component {
  static propTypes = {
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
    if (statusMatches(this.props.health.status, this.props.require)) {
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
    const {
      children,
      fullscreen,
      health: { status, payload }
    } = this.props;

    return (
      <HealthModal
        fullscreen={fullscreen}
        loading={loading}
        payload={payload}
        status={status}
        visible={visible}
      >
        {children}
      </HealthModal>
    );
  }
}

export default RequireHealthOverlay;
