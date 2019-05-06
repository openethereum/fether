// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { from, Observable } from 'rxjs';
import localForage from 'localforage';
import memoize from 'lodash/memoize';
import { switchMap } from 'rxjs/operators';
import 'localforage-observable';

import Debug from '../utils/debug';

const debug = Debug('localForage');

// Use RxJS as Observable in localforage-observable
// https://github.com/localForage/localForage-observable#using-a-different-observable-library
localForage.newObservable.factory = subscribeFn =>
  Observable.create(subscribeFn);

/**
 * Use localStorage.
 *
 * TODO: Maybe other drivers might be more appropriate?
 */
localForage.setDriver(localForage.LOCALSTORAGE);

// Initialize localForage
const ready$ = from(localForage.ready());

/**
 * Create an Observable that will fire when a localForage item updates.
 *
 * @param {string} item - The localForage key to query
 */
const localForage$ = memoize(item => {
  debug(`Listening to "${item}".`);
  return ready$.pipe(switchMap(() => localForage.getItemObservable(item)));
});

export default localForage$;
