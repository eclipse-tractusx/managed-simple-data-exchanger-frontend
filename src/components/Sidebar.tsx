/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import { IntMenuItemProps, MenuItems, icons } from '../models/Sidebar';

/**
 * Menu Item
 * @param props
 * @returns ListItem
 */
const MenuItem: React.FC<IntMenuItemProps> = ({ item, isExpanded }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { menuIcon, to, text, dataId } = item;
  const Icon = icons[menuIcon];
  return (
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
          primary={text}
          sx={{ opacity: open ? 1 : 0, display: !isExpanded ? 'none' : 'flex' }}
        />
      </ListItemButton>
    </ListItem>
  );
};

/**
 * Menu Title
 * @param props
 * @returns Typography
 */
const MenuItemHeading: React.FC<IntMenuItemProps> = ({ item, isExpanded }) => {
  return (
    <>
      <Typography
        variant="body1"
        sx={{
          display: !isExpanded ? 'hidden' : 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          px: 2.4,
          py: 1,
        }}
      >
        {isExpanded ? item.text : item.text.charAt(0)}
      </Typography>
      <Divider />
    </>
  );
};

const Sidebar = ({ isExpanded }: { isExpanded: boolean }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: isExpanded ? 200 : 56,
        height: '100vh',
        overflow: 'hidden',
        borderRight: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <List sx={{ p: 0 }}>
        {MenuItems.map((menuItem, index) => (
          <div key={index}>
            <MenuItemHeading item={menuItem} isExpanded={isExpanded} />
            {menuItem.childrens.map((children, k) => {
              return <MenuItem key={k} item={children} isExpanded={isExpanded} />;
            })}
          </div>
        ))}
      </List>
    </Box>
  );
};
export default Sidebar;
