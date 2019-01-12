// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { HealthModal } from 'fether-ui';
import withHealth, { STATUS } from '../utils/withHealth';
import loading from '../assets/img/icons/loading.svg';

function statusMatches (status, require) {
  switch (require) {
    case 'connected':
      return (
        status !== STATUS.NOINTERNET &&
        status !== STATUS.DOWNLOADING &&
        status !== STATUS.LAUNCHING
      );
    case 'sync':
      return status === STATUS.GOOD;
    default:
      throw new Error(`Status '${status}' must be one of 'connected|sync'.`);
  }
}

@withHealth
class RequireHealthOverlay extends Component {
  static propTypes = {
    require: PropTypes.oneOf(['connected', 'sync']),
    fullscreen: PropTypes.bool
  };

  state = {
    visible: false
  };

  componentDidMount () {
    this.updateVisibility();
  }

  componentDidUpdate () {
    // const { visible } = this.state;

    // console.log('visible: ', visible);

    // setTimeout(() => {
    //   this.setState({ visible: !visible });
    // }, 6000);

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
    const { children, fullscreen, health } = this.props;

    console.log('RequireHealthOverlay: ', fullscreen, health, visible);

    return (
      <HealthModal
        children={children}
        fullscreen={fullscreen}
        health={health}
        loading={loading}
        healthStatusModes={STATUS}
        visible={visible}
      />
    );
  }
}

export default RequireHealthOverlay;
