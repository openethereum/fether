// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';

import App from './App';
import rootStore from './stores';
import './index.css';

ReactDOM.render(
  <Provider {...rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
