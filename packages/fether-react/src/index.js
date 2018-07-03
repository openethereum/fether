// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';

import App from './App';
import rootStore from './stores';
import './index.css';

// Show debug logs
window.localStorage.debug = 'fether*'; // https://github.com/visionmedia/debug#browser-support

ReactDOM.render(
  <Provider {...rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
