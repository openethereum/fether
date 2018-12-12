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

        onChangeFile && onChangeFile(data);

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
    const { label } = this.props;

    return (
      <Dropzone
        className='form_field'
        disabled={false}
        multiple={false}
        onDrop={this.onDrop}
        disableClick
      >
        {({ open }) => (
          <div className='dropzone -md'>
            <label htmlFor='backupKeyfile'>{label}</label>
            <button type='button' className='button' onClick={() => open()}>
              Select File
            </button>
          </div>
        )}
      </Dropzone>
    );
  }
}
