// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { filter, map, publish } from 'rxjs/operators';
import { Observable } from 'rxjs';

const RENDERER_ORIGIN =
  process.env.NODE_ENV === 'production' ? 'file://' : 'http://localhost:3000';

const messages$ = Observable.create(observer => {
  const handler = event => {
    const { data, origin } = event;

    if (origin !== RENDERER_ORIGIN) {
      return;
    }

    if (!data) {
      return;
    }

    const { from } = data;

    if (from === 'fether:react') {
      // Since `payload` and `frontend` have the same origin, we use the `from`
      // field to differentiate who's sending the postMessage to whom. If the
      // message has been sent by `frontend`, we ignore.
      return;
    }

    observer.next(data);
  };

  window.addEventListener('message', handler);

  // Remove listener on unsubscribe
  return () => {
    window.removeEventListener('message', handler);
  };
}).pipe(publish());
// Create hot observable
messages$.connect();

export function listen$ (action) {
  return messages$.pipe(
    filter(data => data.action === action),
    map(({ payload }) => payload)
  );
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
