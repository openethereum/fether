// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ClockNotSync from './ClockNotSync';
import Loading from './Loading';
import NoInternet from './NoInternet';
import { STATUS } from '../stores/healthStore';
import Syncing from './Syncing/Syncing';

@inject('healthStore')
@observer
class Overlays extends Component {
  render () {
    const {
      healthStore: {
        health: { status }
      }
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC: {
        return <ClockNotSync />;
      }
      case STATUS.GOOD: {
        return null;
      }
      case STATUS.NOINTERNET: {
        return <NoInternet />;
      }
      case STATUS.SYNCING: {
        return <Syncing />;
      }

      default:
        return <Loading />;
    }
  }
}

export default Overlays;
