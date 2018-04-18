// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import { defer } from 'rxjs/observable/defer';

/**
 * Calls a function everytime an observer subscribes to an Observable.
 *
 * @param {Function} onSubscribe - The function to call every time the source observable is subscribed.
 * @see https://stackoverflow.com/questions/41883339/observable-onsubscribe-equivalent-in-rxjs
 * @example
 * const source$ = Observable.of(1)
 *   .pipe(doOnSubscribe(() => console.log('Subscribed!')));
 * source$.subscribe(() => {}); // Logs 'Subscribed!'
 */
const doOnSubscribe = onSubscribe => source =>
  defer(() => {
    onSubscribe();
    return source;
  });

export default doOnSubscribe;
