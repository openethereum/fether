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
        if (observables[key] instanceof Observable) {
          // Subscribe if it's an Observable
          this.subscriptions[key] = observables[key].subscribe(value => {
            this.setState({ [key]: value });
          });
        } else if (
          typeof observables[key] === 'function' &&
          observables[key](this.props) instanceof Observable
        ) {
          // If it's a function returning an Observable, subscribe too
          this.subscriptions[key] = observables[key](this.props).subscribe(
            value => {
              this.setState({ [key]: value });
            }
          );
        } else {
          throw new Error(
            `Object with key '${key}' is not an Observable or a function returning an Observable.`
          );
        }
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
