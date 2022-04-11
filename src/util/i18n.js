/*
Copyright 2020 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import Vue from 'vue';

import i18n, { locales } from '../i18n';

const setLocale = (locale) => {
  i18n.locale = locale;
  document.querySelector('html').setAttribute('lang', locale);
};

// Loads a locale asynchronously.
export const loadLocale = (locale) => {
  if (!locales.has(locale)) return Promise.reject(new Error('unknown locale'));

  if (i18n.messages[locale] != null) {
    if (locale !== i18n.locale) setLocale(locale);
    return Promise.resolve();
  }

  return import(
    /* webpackChunkName: "i18n-[request]" */
    `../locales/${locale}.json`
  )
    .then(m => {
      i18n.setLocaleMessage(locale, m.default);
      setLocale(locale);
    })
    .catch(error => {
      Vue.prototype.$logger.log(error);
      throw error;
    });
};

// Combination of $tc() and $n()
export function $tcn(path, count, values = undefined) {
  return this.$tc(path, count, { count: this.$n(count, 'default'), ...values });
}
