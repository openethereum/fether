// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

class ClickToCopy extends PureComponent {
  static defaultProps = {
    label: 'Click to copy'
  };

  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired
  };

  state = {
    copied: false
  };

  componentWillUnmount () {
    window.clearTimeout(this.timeout);
  }

  handleCopy = () => {
    // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    // Note react-copy-to-clipboard created a bug, https://github.com/nkbt/react-copy-to-clipboard/issues/92
    const el = document.createElement('textarea');
    el.value = this.props.textToCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.setState({ copied: true });

    // Show the copied state only for 1s
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(
      () => this.setState({ copied: false }),
      1000
    );
  };

  handleResetCopied = () => {};

  render () {
    const { children, label, ...otherProps } = this.props;
    const { copied } = this.state;

    return (
      <div data-tip='' onClick={this.handleCopy}>
        {children}
        <ReactTooltip
          effect='solid'
          event='mouseover'
          eventOff='mouseout'
          place='bottom'
          getContent={[() => (copied ? 'Copied.' : label), 50]}
          {...otherProps}
        />
      </div>
    );
  }
}

export default ClickToCopy;
