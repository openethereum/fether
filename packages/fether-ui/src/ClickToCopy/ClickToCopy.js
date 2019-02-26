// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import 'semantic-ui-css/components/popup.min.css';

export class ClickToCopy extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    i18n: PropTypes.object,
    label: PropTypes.string.isRequired
  };

  state = {
    copied: false
  };

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
  };

  handleResetCopied = () => this.setState({ copied: false });

  render () {
    const { children, i18n, label, textToCopy, ...otherProps } = this.props;
    const { copied } = this.state;

    return (
      <Popup
        content={copied ? i18n.t('ns1:ui.click_to_copy.copied') : label}
        inverted
        onClose={this.handleResetCopied}
        position='bottom center'
        size='mini'
        trigger={
          <div onClick={this.handleCopy} {...otherProps}>
            {children}
          </div>
        }
      />
    );
  }
}
