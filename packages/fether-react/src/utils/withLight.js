// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import * as React from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";

export default rpcs =>
  compose(
    inject("parityStore"),
    observer,
    T =>
      class Hoc extends React.PureComponent {
        state = {
          Component: null
        };

        componentDidUpdate(prevProps) {
          if (!prevProps.parityStore.light && this.props.parityStore.light) {
            this.setState({
              Component: this.props.parityStore.light.hoc(
                rpcs(this.props.parityStore.light)
              )(T)
            });
          }
        }

        render() {
          const { Component } = this.state;
          return <Component {...this.props} />;
        }
      }
  );
