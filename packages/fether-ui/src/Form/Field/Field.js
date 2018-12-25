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
    input: PropTypes.any,
    label: PropTypes.string,
    meta: PropTypes.object
  };

  static defaultProps = {
    as: 'input'
  };

  render () {
    const { as, children, input, label, meta, ...otherProps } = this.props;

    const trigger = React.createElement(as, { id: input && input.name }, [
      ...input,
      ...otherProps
    ]);

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
