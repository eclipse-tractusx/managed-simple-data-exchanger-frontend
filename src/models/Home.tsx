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
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { icons } from '../models/Sidebar';

export interface IStepLink {
  text: string;
  routeUrl: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, 'svg'>>;
}

export interface IDataSteps {
  stepNum: number;
  stepTitle: string;
  stepLink?: IStepLink;
}

export const provideDataSteps: IDataSteps[] = [
  {
    stepNum: 1,
    stepTitle: 'content.home.provideDataStep.downloadTemplate',
    stepLink: {
      text: 'pages.help',
      routeUrl: '/help',
      icon: icons.HelpIcon,
    },
  },
  {
    stepNum: 2,
    stepTitle: 'content.home.provideDataStep.fillTemplate',
  },
  {
    stepNum: 3,
    stepTitle: 'content.home.provideDataStep.createDataText',
    stepLink: {
      text: 'pages.createData',
      routeUrl: '/create-data',
      icon: icons.AddCircleIcon,
    },
  },
  {
    stepNum: 4,
    stepTitle: 'content.home.provideDataStep.manageUploadContract',
    stepLink: {
      text: 'pages.uploadHistory',
      routeUrl: '/upload-history',
      icon: icons.HistoryIcon,
    },
  },
];

export const consumeDataSteps: IDataSteps[] = [
  {
    stepNum: 1,
    stepTitle: 'content.home.consumeDataSteps.discoverCatalog',
    stepLink: {
      text: 'pages.consumeData',
      routeUrl: '/consume-data',
      icon: icons.ManageSearchIcon,
    },
  },
  {
    stepNum: 2,
    stepTitle: 'content.home.consumeDataSteps.subscribeDataOffer',
  },
  {
    stepNum: 3,
    stepTitle: 'content.home.consumeDataSteps.manageContracts',
    stepLink: {
      text: 'pages.contractHistory',
      routeUrl: '/contract-history',
      icon: icons.HistoryIcon,
    },
  },
];
