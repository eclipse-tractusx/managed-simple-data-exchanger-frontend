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

import AddCircleIcon from '@mui/icons-material/AddCircle';
import HelpIcon from '@mui/icons-material/Help';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

export const icons = {
  AddCircleIcon,
  HistoryIcon,
  HelpIcon,
  ManageSearchIcon,
  HomeIcon,
};

export interface IntMenuItem {
  text: string;
  to?: string;
  menuIcon?: keyof typeof icons;
  dataId?: string;
  isHeading?: boolean;
  permissions?: string[];
}

export interface IntMenu extends IntMenuItem {
  childrens?: IntMenuItem[];
}

// menu items
export const MenuItems: IntMenu[] = [
  {
    text: 'pages.home',
    menuIcon: 'HomeIcon',
    to: '/',
    dataId: 'homePage',
    isHeading: false,
  },
  {
    text: 'pages.provider',
    isHeading: true,
    childrens: [
      {
        text: 'pages.createData',
        menuIcon: 'AddCircleIcon',
        to: '/create-data',
        dataId: 'uploadFileMenu',
        permissions: ['provider_create_contract_offer'],
      },
      {
        text: 'pages.uploadHistory',
        menuIcon: 'HistoryIcon',
        to: '/upload-history',
        dataId: 'uploadHistoryMenu',
        permissions: ['provider_view_history'],
      },
      {
        text: 'pages.help',
        menuIcon: 'HelpIcon',
        to: '/help',
        dataId: 'helpMenu',
      },
    ],
  },
  {
    text: 'pages.consumer',
    isHeading: true,
    childrens: [
      {
        text: 'pages.consumeData',
        menuIcon: 'ManageSearchIcon',
        to: '/consume-data',
        dataId: 'uploadFileMenu',
        permissions: [
          'consumer_search_connectors',
          'consumer_view_contract_offers',
          'consumer_establish_contract_agreement',
          '',
        ],
      },
      {
        text: 'pages.contractHistory',
        menuIcon: 'HistoryIcon',
        to: '/contract-history',
        dataId: 'uploadHistoryMenu',
        permissions: ['consumer_view_contract_agreement'],
      },
    ],
  },
];
