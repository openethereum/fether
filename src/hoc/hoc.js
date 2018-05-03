// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Observable } from 'rxjs/Observable';

const hoc = observables => InnerComponent =>
  class extends Component {
    subscriptions = {}; // All Observable subscriptions

    componentDidMount () {
      Object.keys(observables).forEach(key => {
        const rpc$ = observables[key];
        if (typeof rpc$ !== 'function') {
          throw new Error(
            `Object with key '${key}' should be a function returning an Observable.`
          );
        }

        const obs$ = rpc$(this.props);
        if (!(obs$ instanceof Observable)) {
          throw new Error(
            `Object with key '${key}' should be a function returning an Observable.`
          );
        }

        // Subscribe to the observable
        this.subscriptions[key] = obs$.subscribe(value => {
          this.setState({ [key]: value });
        });
      });
    }

    componentWillUnmount () {
      Object.values(this.subscriptions).forEach(subscription => {
        subscription.unsubscribe();
      });
    }

    render () {
      return <InnerComponent {...this.state} {...this.props} />;
    }
  };

export default hoc;
