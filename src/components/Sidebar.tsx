/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { icons, IntMenuItem, MenuItems } from '../models/Sidebar';
import { useAppSelector } from '../store/store';
import Permissions from './Permissions';

const MenuItem = ({ item }: { item: IntMenuItem }) => {
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
          <ListItemIcon sx={{ minWidth: 30 }}>
            <Icon
              fontSize="small"
              sx={{
                color: `${location.pathname === to ? theme.palette.primary.main : theme.palette.common.black}`,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ sx: { fontSize: '14px' } }}
            primary={t(text)}
            sx={{ opacity: open ? 1 : 0, display: !sidebarExpanded ? 'none' : 'flex' }}
          />
        </ListItemButton>
      </ListItem>
    </Permissions>
  );
};

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

export default function Sidebar() {
  const theme = useTheme();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  return (
    <Box
      sx={{
        width: sidebarExpanded ? 200 : 56,
        height: '100vh',
        overflow: 'hidden',
        borderRight: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <List sx={{ p: 0 }}>
        {MenuItems.map((menuItem, index) => (
          <div key={index}>
            {/* Menu heading */}
            {menuItem.isHeading ? <MenuItemHeading text={menuItem.text} /> : <MenuItem key={index} item={menuItem} />}
            {/* Menu children */}
            {menuItem.childrens?.map((children, k) => (
              <MenuItem key={k} item={children} />
            ))}
          </div>
        ))}
      </List>
    </Box>
  );
}
