// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import electron from 'electron';
import settings from 'electron-settings';

import Pino from '../../utils/pino';

import { en } from './locales';

let { app } = electron;
const pino = Pino();

const i18n = i18next;
i18n
  .use(Backend)
  .init({
    debug: true,
    defaultNS: 'ns1',
    fallbackLng: ['en-US', 'en'],
    interpolation: {
      escapeValue: false
    },
    lng: settings.get('fether-language') || 'en',
    ns: ['ns1'],
    resources: {
      en: {
        ns1: en
      }
    },
    saveMissing: true
  })
  .then(() => pino.info('i18n backend: success'))
  .catch(error => pino.info('i18n backend: failure', error));

// https://www.i18next.com/overview/api#changelanguage
i18n.changeLanguage(app.getLocale(), (err, t) => {
  if (err) {
    pino.info(`i18n backend: Error loading language ${app.getLocale()}`, err);
  }
});

i18next.on('initialized', options => {
  pino.info('i18n backend: Detected initialisation of i18n');
});

i18next.on('loaded', loaded => {
  pino.info('i18n backend: Detected success loading resources', loaded);
});

i18next.on('failedLoading', (lng, ns, msg) => {
  pino.info('i18n backend: Detected failure loading resources', lng, ns, msg);
});

// saveMissing must be configured to `true`
i18next.on('missingKey', (lngs, namespace, key, res) => {
  pino.info('i18n backend: Detected missing key: ', lngs, namespace, key, res);
});

i18next.store.on('added', (lng, ns) => {
  pino.info('i18n backend: Detected resources added', lng, ns);
});

i18next.store.on('removed', (lng, ns) => {
  pino.info('i18n backend: Detected resources removed', lng, ns);
});

// https://www.i18next.com/overview/api#changelanguage
i18next.on('languageChanged', lng => {
  pino.info('i18n backend: Detected language change to: ', lng);
});

export default i18n;
