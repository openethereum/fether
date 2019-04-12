// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import electron from 'electron';
import settings from 'electron-settings';

import { name } from '../../../../../package.json';
import Pino from '../../utils/pino';
import { en } from './locales';

let { app } = electron;
const pino = Pino();
let resourceEnglishNS = {};
resourceEnglishNS[name] = en;
const packageNS = Object.keys(resourceEnglishNS)[0].toString();
const moduleNS = 'i18n';
const menuNS = `${packageNS}-${moduleNS}`;

const i18n = i18next;
i18n
  .use(Backend)
  .init({
    debug: true,
    defaultNS: packageNS,
    fallbackLng: ['en-US', 'en'],
    interpolation: {
      escapeValue: false
    },
    lng: settings.get('fether-language') || 'en',
    ns: [packageNS],
    resources: {
      en: resourceEnglishNS
    },
    saveMissing: true
  })
  .then(() => pino.info(`${menuNS}: success`))
  .catch(error => pino.info(`${menuNS}: failure`, error));

// FIXME i18n - convert all text below to i18n

// https://www.i18next.com/overview/api#changelanguage
i18n.changeLanguage(app.getLocale(), (err, t) => {
  if (err) {
    pino.info(`${menuNS}: Error loading language ${app.getLocale()}`, err);
  }
});

i18next.on('initialized', options => {
  pino.debug(`${menuNS}: Detected initialisation of i18n`);
});

i18next.on('loaded', loaded => {
  pino.info(`${menuNS}: Detected success loading resources: `, loaded);
});

i18next.on('failedLoading', (lng, ns, msg) => {
  pino.info(`${menuNS}: Detected failure loading resources: `, lng, ns, msg);
});

// saveMissing must be configured to `true`
i18next.on('missingKey', (lngs, namespace, key, res) => {
  pino.info(`${menuNS}: Detected missing key: `, lngs, namespace, key, res);
});

i18next.store.on('added', (lng, ns) => {
  pino.debug(`${menuNS}: Detected resources added: `, lng, ns);
});

i18next.store.on('removed', (lng, ns) => {
  pino.debug(`${menuNS}: Detected resources removed: `, lng, ns);
});

// https://www.i18next.com/overview/api#changelanguage
i18next.on('languageChanged', lng => {
  pino.info(`${menuNS}: Detected language change to: `, lng);
});

export default i18n;
