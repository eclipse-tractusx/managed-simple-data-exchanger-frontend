/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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

interface IDefaultObject {
  [key: string]: string;
}
const CONTRACT_STATES: string[] = ['CONFIRMED', 'DECLINED', 'ERROR'];

const STATUS_COLOR_MAPPING: IDefaultObject = {
  IN_PROGRESS: theme.palette.info.main,
  CONFIRMED: theme.palette.success.main,
  COMPLETED: theme.palette.success.main,
  DECLINED: theme.palette.error.main,
  ERROR: theme.palette.error.main,
  FAILED: theme.palette.error.main,
};

const USER_TYPE_SWITCH: IDefaultObject = {
  provider: 'consumer',
  consumer: 'provider',
};

const DURATION_UNITS = [
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

const PURPOSE_VALUES = [
  {
    id: 0,
    title: 'ID 3.0 Trace',
    value: 'ID 3.0 Trace',
  },
];

export { CONTRACT_STATES, DURATION_UNITS, PURPOSE_VALUES, STATUS_COLOR_MAPPING, USER_TYPE_SWITCH };
