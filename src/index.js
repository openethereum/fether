// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Api from '@parity/api';
import light from '@parity/light.js';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';

import App from './App';
import rootStore from './stores';

light.setApi(
  new Api(new Api.Provider.Ws('ws://127.0.0.1:8546', 'RH1HrYfp52IjDSKD'))
);

ReactDOM.render(
  <Provider {...rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
