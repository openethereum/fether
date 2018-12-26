// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { Popup } from 'semantic-ui-react';
import 'semantic-ui-css/components/popup.min.css';
import PropTypes from 'prop-types';

export class Field extends React.Component {
  static propTypes = {
    as: PropTypes.any,
    children: PropTypes.node,
    onSubmit: PropTypes.func,
    noFocus: PropTypes.boolean,
    input: PropTypes.any,
    label: PropTypes.string,
    meta: PropTypes.object
  };

  static defaultProps = {
    as: 'input'
  };

  constructor (props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount () {
    const { noFocus } = this.props;
    !noFocus && this.inputRef.current.focus();
  }

  render () {
    const {
      as,
      children,
      input,
      label,
      meta,
      onSubmit,
      ...otherProps
    } = this.props;

    const trigger = React.createElement(as, {
      id: input && input.name,
      ref: this.inputRef,
      onKeyDown: e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          onSubmit && onSubmit();
        }
      },
      ...input,
      ...otherProps
    });

    return (
      <div className='form_field'>
        <label htmlFor={input && input.name}>{label}</label>
        <Popup
          content={meta && (meta.error || meta.submitError)}
          inverted
          on='click'
          open={
            !!meta &&
            !meta.valid &&
            (!meta.pristine || meta.touched) &&
            !meta.dirtySinceLastSubmit
          }
          position='bottom center'
          size='mini'
          trigger={trigger}
        />
        {children}
      </div>
    );
  }
}
