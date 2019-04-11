// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// https://react.i18next.com/getting-started
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import store from 'store';

import { name } from '../../package.json';
import Debug from '../utils/debug';
import { en, de } from './locales';

const LANG_LS_KEY = 'fether-language';
let resourceEnglishNS = {};
let resourceGermanNS = {};
resourceEnglishNS[name] = en;
resourceGermanNS[name] = de;
const packageNS = Object.keys(resourceEnglishNS)[0].toString();
const moduleNS = 'i18n';
const menuNS = `${packageNS}-${moduleNS}`;
const debug = Debug(menuNS);

const i18n = i18next;
i18n
  .use(initReactI18next)
  .init({
    debug: true,
    defaultNS: packageNS,
    fallbackLng: ['en-US', 'en', 'de-DE', 'de'],
    interpolation: {
      escapeValue: false
    },
    lng: store.get(LANG_LS_KEY) || 'en',
    ns: [packageNS],
    // https://react.i18next.com/misc/using-with-icu-format
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
    resources: {
      en: resourceEnglishNS,
      de: resourceGermanNS
    },
    saveMissing: true
  })
  .then(() => debug('success'))
  .catch(error => debug('failure', error));

// https://www.i18next.com/overview/api#changelanguage
i18n.changeLanguage(navigator.language, (err, t) => {
  if (err) {
    debug(`Error loading language ${navigator.language}: `, err);
  }
});

i18next.on('initialized', options => {
  debug('Detected initialisation of i18n');
});

i18next.on('loaded', loaded => {
  debug('Detected success loading resources: ', loaded);
});

i18next.on('failedLoading', (lng, ns, msg) => {
  debug('Detected failure loading resources: ', lng, ns, msg);
});

// saveMissing must be configured to `true`
i18next.on('missingKey', (lngs, namespace, key, res) => {
  debug('Detected missing key: ', lngs, namespace, key, res);
});

i18next.store.on('added', (lng, ns) => {
  debug('Detected resources added: ', lng, ns);
});

i18next.store.on('removed', (lng, ns) => {
  debug('Detected resources removed: ', lng, ns);
});

// https://www.i18next.com/overview/api#changelanguage
i18next.on('languageChanged', lng => {
  debug('Detected language change to: ', lng);
});

export default i18n;

export { packageNS };
