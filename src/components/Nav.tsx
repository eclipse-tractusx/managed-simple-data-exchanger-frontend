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

import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, Divider, Paper, useTheme } from '@mui/material';
import { LanguageSwitch, Typography, UserAvatar, UserMenu, UserNav } from 'cx-portal-shared-components';
import i18next, { changeLanguage } from 'i18next';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { setSidebarExpanded } from '../features/app/slice';
import I18nService from '../services/i18nService';
import { useAppDispatch, useAppSelector } from '../store/store';

// eslint-disable-next-line
const Nav = () => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const avatar = useRef<HTMLDivElement>(null);
  const [lang, setlang] = useState(i18next.language);
  const { loggedInUser } = useAppSelector(state => state.appSlice);
  const NAV_ITEMS = [{ title: loggedInUser.company }, { title: loggedInUser.bpn }, { title: 'Logout', to: 'logout' }];
  const dispatch = useAppDispatch();

  const openCloseMenu = () => setMenuOpen(prevVal => !prevVal);
  const onClickAway = (e: MouseEvent | TouchEvent) => {
    if (!avatar.current?.contains(e.target as HTMLDivElement)) {
      setMenuOpen(false);
    }
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
        zIndex: 10,
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
          <Box onClick={() => dispatch(setSidebarExpanded())}>
            <MenuOutlinedIcon fontSize="medium" sx={{ color: theme.palette.common.white }} />
          </Box>
          <Typography variant="h4" color="white" ml={3}>
            {t('logo')}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Box ref={avatar}>
            <UserAvatar onClick={openCloseMenu} sx={{ bgcolor: 'white', color: 'black' }} />
          </Box>
          <UserMenu
            open={menuOpen}
            userName={loggedInUser.name}
            top={50}
            userRole={loggedInUser.roles.toString()}
            onClickAway={onClickAway}
          >
            <UserNav sx={{ my: 1 }} component={Link} items={NAV_ITEMS} />
            <Divider />
            <LanguageSwitch
              current={lang}
              languages={I18nService.supportedLanguages.map(key => ({
                key,
              }))}
              onChange={e => {
                changeLanguage(e);
                setlang(e);
              }}
            />
          </UserMenu>
        </Box>
      </Box>
    </Paper>
  );
};
export default Nav;
