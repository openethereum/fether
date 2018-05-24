// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route, withRouter } from 'react-router-dom';

/**
 * Protected routes are routes that cannot be access if parity Api is not
 * connected yet.
 */
// https://github.com/mobxjs/mobx-react/issues/210
@withRouter
@inject('parityStore')
@observer
class ProtectedRoute extends PureComponent {
  render () {
    const { component, parityStore, ...rest } = this.props;

    return <Route {...rest} render={this.renderComponent} />;
  }

  renderComponent = props => {
    const {
      component: RoutedComponent,
      parityStore: { isApiConnected }
    } = this.props;

    return isApiConnected
      ? <RoutedComponent {...props} />
      : <Redirect to='/loading' />;
  };
}

export default ProtectedRoute;
