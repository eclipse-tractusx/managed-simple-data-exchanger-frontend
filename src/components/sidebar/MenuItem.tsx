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

import { ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../features/store';
import { icons, IntMenuItem } from '../../helpers/SidebarHelper';
import Permissions from '../Permissions';

export default function MenuItem({ item }: { item: IntMenuItem }) {
  const theme = useTheme();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { menuIcon, to, text, dataId } = item;
  const Icon = icons[menuIcon];
  return (
    <Permissions values={item.permissions}>
      <ListItem data-testid={dataId} onClick={() => navigate(to)} sx={{ p: 0 }}>
        <ListItemButton sx={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            sx={{
              minWidth: 30,
            }}
          >
            <Icon
              fontSize="small"
              sx={{
                color: `${location.pathname === to ? theme.palette.primary.main : theme.palette.common.black}`,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: {
                fontSize: '14px',
                color: `${location.pathname === to ? theme.palette.primary.main : theme.palette.common.black}`,
              },
            }}
            primary={t(text)}
            sx={{
              opacity: open ? 1 : 0,
              display: !sidebarExpanded ? 'none' : 'flex',
            }}
          />
        </ListItemButton>
      </ListItem>
    </Permissions>
  );
}
