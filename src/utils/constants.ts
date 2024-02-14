/********************************************************************************
 * Copyright (c) 2023,2024 T-Systems International GmbH
 * Copyright (c) 2023,2024 Contributors to the Eclipse Foundation
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

import { theme } from 'cx-portal-shared-components';

import { IDefaultObject, ISelectList } from '../models/Common';
import { PolicyModel } from '../models/RecurringUpload.models';
import { Config } from './config';

const USER_GUIDE_URL =
  'https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/blob/main/docs/user-guide/README.md';

const MAX_CONTRACTS_AGREEMENTS = 2147483647;

const ONLY_NUM_REGEX = /^[1-9]\d*$/;

const ALPHA_NUM_REGEX = /[a-zA-Z0-9]$/;

const SPACE_CHECK_REGEX = /^\S*$/;

const CONTRACT_STATES = ['FINALIZED', 'DECLINED', 'TERMINATED', 'ERROR'];

const STATUS_COLOR_MAPPING: IDefaultObject = {
  IN_PROGRESS: theme.palette.info.main,
  FINALIZED: theme.palette.success.main,
  COMPLETED: theme.palette.success.main,
  TERMINATED: theme.palette.error.main,
  DECLINED: theme.palette.error.main,
  ERROR: theme.palette.error.main,
  FAILED: theme.palette.error.main,
  PARTIALLY_FAILED: theme.palette.error.main,
};

const USER_TYPE_SWITCH: IDefaultObject = {
  provider: 'consumer',
  consumer: 'provider',
};

const DURATION_UNITS: ISelectList[] = [
  {
    id: 0,
    title: 'Hour',
    value: 'HOUR',
  },
  {
    id: 1,
    title: 'Day',
    value: 'DAY',
  },
  {
    id: 2,
    title: 'Month',
    value: 'MONTH',
  },
  {
    id: 3,
    title: 'Year',
    value: 'YEAR',
  },
];

const DURATION_UNIT_MAPPING = {
  HOUR: 'hours',
  DAY: 'days',
  MONTH: 'months',
  YEAR: 'years',
};

const BPN_TYPE_FIELDS = [
  {
    id: 1,
    title: 'Company Name',
    value: 'company',
  },
  {
    id: 2,
    title: 'Business Partner Number',
    value: 'bpn',
  },
];

const TRACABILITY_FRAMEWORK = [
  {
    key: 'Version',
    value: 'active',
  },
];

const QUALTIY_FRAMEWORK = [
  {
    key: 'Version',
    value: 'active',
  },
];

const PCF_FRAMEWORK = [
  {
    key: 'Version',
    value: 'active',
  },
];

const PURPOSE_VALUES = [
  {
    key: 'ID 3.1 Trace',
    value: 'ID 3.1 Trace',
  },
];

const CHECKBOXES = [
  { name: 'membership', title: 'Membership', type: 'checkbox', values: '' },
  { name: 'dismantler', title: 'Dismantler', type: 'checkbox', values: '' },
];

const FRAMEWORKS = [
  { name: 'traceability', title: 'Framework Traceability', type: 'select', values: TRACABILITY_FRAMEWORK },
  { name: 'quality', title: 'Framework Quality', type: 'select', values: QUALTIY_FRAMEWORK },
  { name: 'pcf', title: 'Framework PCF', type: 'select', values: PCF_FRAMEWORK },
  { name: 'purpose', title: 'Select Purpose', type: 'select', values: PURPOSE_VALUES },
];

const DEFAULT_POLICY_DATA: PolicyModel = {
  uuid: '',
  policy_name: '',
  inputBpn: '',
  access_policies: [
    {
      technicalKey: 'BusinessPartnerNumber',
      value: [Config.REACT_APP_DEFAULT_COMPANY_BPN],
    },
    {
      technicalKey: 'Membership',
      value: false,
    },
    {
      technicalKey: 'Dismantler',
      value: false,
    },
  ],
  usage_policies: [
    {
      technicalKey: 'Membership',
      value: false,
    },
    {
      technicalKey: 'Dismantler',
      value: false,
    },
    {
      technicalKey: 'FrameworkAgreement.traceability',
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.quality',
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.pcf',
      value: '',
    },
    {
      technicalKey: 'PURPOSE',
      value: '',
    },
  ],
};

export {
  ALPHA_NUM_REGEX,
  BPN_TYPE_FIELDS,
  CHECKBOXES,
  CONTRACT_STATES,
  DEFAULT_POLICY_DATA,
  DURATION_UNIT_MAPPING,
  DURATION_UNITS,
  FRAMEWORKS,
  MAX_CONTRACTS_AGREEMENTS,
  ONLY_NUM_REGEX,
  PCF_FRAMEWORK,
  PURPOSE_VALUES,
  QUALTIY_FRAMEWORK,
  SPACE_CHECK_REGEX,
  STATUS_COLOR_MAPPING,
  TRACABILITY_FRAMEWORK,
  USER_GUIDE_URL,
  USER_TYPE_SWITCH,
};
