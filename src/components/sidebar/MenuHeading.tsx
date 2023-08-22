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

import { Divider } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../features/store';

const MenuItemHeading = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  return (
    <>
      <Divider />
      <Typography
        variant="body1"
        sx={{
          display: !sidebarExpanded ? 'hidden' : 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          px: 2.4,
          py: 1,
        }}
      >
        {sidebarExpanded ? t(text) : t(text).charAt(0)}
      </Typography>
      <Divider />
    </>
  );
};

export default MenuItemHeading;
