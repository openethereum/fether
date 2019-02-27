// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// https://react.i18next.com/getting-started
import i18next from 'i18next';
// // https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from 'i18next-browser-languagedetector';
// // https://www.npmjs.com/package/i18next-xhr-backend
// import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import store from 'store';

import { en, de } from './locales';

const LANG_LS_KEY = 'fether-language';

const i18n = i18next;
i18n
  // .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    defaultNS: 'ns1',
    fallbackLng: ['en-US', 'en', 'de-DE', 'de'],
    interpolation: {
      escapeValue: false
    },
    lng: store.get(LANG_LS_KEY) || 'en',
    ns: ['ns1'],
    // https://react.i18next.com/misc/using-with-icu-format
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
    resources: {
      en: {
        ns1: en
      },
      de: {
        ns1: de
      }
    },
    saveMissing: true
  })
  .then(() => console.log('i18n: success'))
  .catch(error => console.log('i18n: failure', error));

// https://www.i18next.com/overview/api#changelanguage
i18n.changeLanguage(navigator.language, (err, t) => {
  if (err) {
    console.log(`Error loading language ${navigator.language}`, err);
  }
});

i18next.on('initialized', options => {
  console.log('Detected initialisation of i18n');
});

i18next.on('loaded', loaded => {
  console.log('Detected success loading resources', loaded);
});

i18next.on('failedLoading', (lng, ns, msg) => {
  console.log('Detected failure loading resources', lng, ns, msg);
});

// saveMissing must be configured to `true`
i18next.on('missingKey', (lngs, namespace, key, res) => {
  console.log('Detected missing key: ', lngs, namespace, key, res);
});

i18next.store.on('added', (lng, ns) => {
  console.log('Detected resources added', lng, ns);
});

i18next.store.on('removed', (lng, ns) => {
  console.log('Detected resources removed', lng, ns);
});

// https://www.i18next.com/overview/api#changelanguage
i18next.on('languageChanged', lng => {
  console.log('Detected language change to: ', lng);
});

// i18n.changeLanguage('de');
// console.log('i18n.language: ', i18n.language);

export default i18n;
