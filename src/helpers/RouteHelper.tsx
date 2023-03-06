/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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
import { ReactElement } from 'react';

import ConsumeData from '../pages/ConsumeData';
import ConsumerContracts from '../pages/ConsumerContracts';
import CreateData from '../pages/CreateData';
import Help from '../pages/Help';
import Home from '../pages/Home';
import Logout from '../pages/Logout';
import PageNotFound from '../pages/PageNotFound';
import ProviderContracts from '../pages/ProviderContracts';
import UploadHistory from '../pages/UploadHistory';

export interface IRoutes {
  key?: string;
  path: string;
  element: ReactElement;
  permissions?: string[];
}
export const ROUTES: IRoutes[] = [
  // Common routes
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  // Provider routes
  {
    path: '/provider/create-data',
    element: <CreateData />,
    permissions: ['provider_create_contract_offer'],
  },
  {
    path: 'provider/upload-history',
    element: <UploadHistory />,
    permissions: ['provider_view_history'],
  },
  {
    path: '/provider/contracts',
    element: <ProviderContracts />,
    permissions: ['provider_view_contract_agreement'],
  },
  {
    path: '/provider/help',
    element: <Help />,
  },
  // Consumer routes
  {
    path: '/consumer/consume-data',
    element: <ConsumeData />,
    permissions: [
      'consumer_search_connectors',
      'consumer_view_contract_offers',
      'consumer_establish_contract_agreement',
    ],
  },
  {
    path: '/consumer/contracts',
    element: <ConsumerContracts />,
    permissions: ['consumer_view_contract_agreement'],
  },
];
