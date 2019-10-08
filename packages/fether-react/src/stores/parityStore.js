// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { observable } from 'mobx';
import Api from '@parity/api';
import { distinctUntilChanged, map } from 'rxjs/operators';
import light from '@parity/light.js';
import { timer } from 'rxjs';
import PostMessageProvider from '../utils/PostMessageProvider';

export class ParityStore {
  // TODO This is not working
  // api.on('connected', () => ...);
  // api.on('disconnected', () => ...);
  // So instead, we poll every 1s
  isApiConnected$ = timer(0, 1000).pipe(
    map(_ => Boolean(this.api && this.api.isConnected)),
    distinctUntilChanged()
  );

  @observable
  api = undefined;

  constructor () {
    const provider = new PostMessageProvider();

    const api = new Api(provider);

    // Initialize the light.js lib
    light.setApi(api);

    // Also set api as member for React Components to use it if needed
    this.api = api;
  }
}

export default new ParityStore();
