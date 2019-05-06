// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import Debug from '../utils/debug';

const debug = Debug('postMessage');
const RENDERER_ORIGIN = 'http://localhost:3000';

console.log('BBB');
const messages$ = Observable.create(observer => {
  console.log('AAA');
  const handler = event => {
    const { data, origin } = event;

    if (origin !== RENDERER_ORIGIN) {
      console.warn(
        `Received postMessage from unknown origin '${origin}'. Ignoring.`
      );
      return;
    }

    if (!data) {
      console.warn(
        `Received postMessage with empty data from ${origin}. Ignoring.`
      );
      return;
    }

    const { from } = data;

    if (from === 'fether:react') {
      // Since `payload` and `frontend` have the same origin, we use the `from`
      // field to differentiate who's sending the postMessage to whom. If the
      // message has been sent by `frontend`, we ignore.
      return;
    }

    debug(`Received post message from ${from ? `${from}` : ''}`, data);

    observer.next(data);
  };

  window.addEventListener('message', handler);

  // Remove listener on unsubscribe
  return () => {
    window.removeEventListener('message', handler);
  };
});

export function listen$ (action) {
  console.log('listen$', action);
  return messages$.pipe(filter(data => data.action === action));
}

export function send (action, payload) {
  window.postMessage(
    {
      action,
      from: 'fether:react',
      payload
    },
    RENDERER_ORIGIN
  );
}
