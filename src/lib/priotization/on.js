// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

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
