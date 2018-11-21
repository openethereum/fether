// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

export class InputFile extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChangeFile: PropTypes.func.isRequired,
    required: PropTypes.bool,
    value: PropTypes.any
  };

  state = {
    file: {
      name: '',
      size: 0
    }
  };

  onDrop = files => {
    const { onChangeFile } = this.props;

    files.forEach(file => {
      const reader = new window.FileReader();

      reader.onabort = () => {
        // ignore
      };

      reader.onerror = () => {
        // ignore
      };

      reader.onload = evt => {
        const data = evt.target.result;

        onChangeFile && onChangeFile(evt);

        this.setState({
          file: {
            name: file.name,
            size: data.length
          }
        });
      };

      reader.readAsText(file);
    });
  };

  render () {
    const acceptedFormats = ['application/json', 'text/plain'].join(', ');

    const { label } = this.props;
    const { file } = this.state;

    return (
      <Dropzone
        accept={acceptedFormats}
        className='form_field'
        disabled={false}
        multiple={false}
        onDrop={this.onDrop}
      >
        <div className='form_field_value'>
          <label className='label'> {label} </label>
          <div className='dropzone -sm'>
            {!file ? 'Drag and drop the file here' : file.name}
          </div>
        </div>
      </Dropzone>
    );
  }
}
