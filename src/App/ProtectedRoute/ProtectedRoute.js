// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route, withRouter } from 'react-router-dom';

@withRouter // https://github.com/mobxjs/mobx-react/issues/210
@inject('parityStore')
@observer
class ProtectedRoute extends Component {
  render () {
    const {
      component: RoutedComponent,
      parityStore: { isApiConnected },
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          isApiConnected ? (
            <RoutedComponent {...props} />
          ) : (
            <Redirect to='/loading' />
          )
        }
      />
    );
  }
}

export default ProtectedRoute;
