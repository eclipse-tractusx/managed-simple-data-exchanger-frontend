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

import { Logout } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, Link, Paper, useTheme } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from 'cx-portal-shared-components';
import React, { useState } from 'react';

import UserService from '../services/UserService';

// eslint-disable-next-line
const Nav = (props: any) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleExpanded = () => {
    if (isExpanded) {
      setIsExpanded(false);
      props.getIsExpanded(false);
      return;
    }
    setIsExpanded(true);
    props.getIsExpanded(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = () => {
    localStorage.clear();
    UserService.doLogout();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        background: theme.palette.primary.main,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        borderRadius: 0,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          height: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          px: 2,
        }}
      >
        <Box display={'flex'} alignItems="center">
          <Link onClick={handleExpanded}>
            <MenuOutlinedIcon fontSize="medium" sx={{ color: theme.palette.common.white }} />
          </Link>

          <Typography variant="h4" color="white" ml={3}>
            Simple Data Exchanger
          </Typography>
        </Box>
        <Link onClick={handleMenu}>
          <AccountCircleIcon sx={{ color: theme.palette.common.white }} />
        </Link>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={logout}>
            <span>
              <Logout /> &nbsp; Logout
            </span>
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};
export default Nav;
