/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/
import i18n, { changeLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, useTranslation } from 'react-i18next';

import mainDE from '../assets/locales/de/main.json';
import mainEN from '../assets/locales/en/main.json';

const resources = {
  en: {
    translation: mainEN,
  },
  de: {
    translation: mainDE,
  },
};

const supportedLanguages = Object.keys(resources);

const init = (): void => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'de'],
      interpolation: {
        escapeValue: false,
      },
    })
    .catch(e => console.error('Translation library init got error:', e));
};

const I18nService = {
  init,
  changeLanguage,
  useTranslation,
  supportedLanguages,
};

export default I18nService;
