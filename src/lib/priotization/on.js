// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import {
  distinctUntilChanged,
  filter,
  shareReplay,
  startWith
} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';

import api from '../api';

/**
 * Observable that emits each time accounts change.
 */
export const onAccountsChanged$ = Subject.create().pipe(startWith(0));
onAccountsChanged$.metadata = { name: 'onAccountsChanged$' };

/**
 * Observable that emits on every new block.
 */
export const onEveryBlock$ = Observable.create(observer => {
  api.pubsub.eth.blockNumber((error, result) => {
    if (error) {
      observer.error(error);
    } else {
      observer.next(+result);
    }
  });
}).pipe(startWith(0), distinctUntilChanged(), shareReplay(1));
onEveryBlock$.metadata = { name: 'onEveryBlock$' };

/**
 * Observable that emits on every 2nd block.
 */
export const onEvery2Blocks$ = onEveryBlock$.pipe(filter(n => n % 2 === 0)); // Around ~30s on mainnet
onEvery2Blocks$.metadata = { name: 'onEvery2Blocks$' };

/**
 * Observable that emits on every 4th block.
 */
export const onEvery4Blocks$ = onEveryBlock$.pipe(filter(n => n % 4 === 0)); // Around ~1min on mainnet
onEvery4Blocks$.metadata = { name: 'onEvery4Blocks$' };

/**
 * Observable that emits only once.
 */
export const onlyAtStartup$ = Observable.of(0);
onlyAtStartup$.metadata = { name: 'onlyAtStartup$' };
