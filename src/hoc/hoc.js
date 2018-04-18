// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

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
