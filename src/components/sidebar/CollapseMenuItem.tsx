/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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

import { theme } from '@catena-x/portal-shared-components';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { version } from '../../../package.json';
import { setSidebarExpanded } from '../../features/app/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';

// eslint-disable-next-line @typescript-eslint/no-var-requires

export default function CollapseMenuItem() {
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <>
      <ListItem sx={{ px: sidebarExpanded ? 2 : '6px' }}>
        {sidebarExpanded ? `SDE v${version}` : `v${version}`}
      </ListItem>
      <ListItem onClick={() => dispatch(setSidebarExpanded())} sx={{ p: 0 }}>
        <ListItemButton sx={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            sx={{
              minWidth: 30,
            }}
          >
            {sidebarExpanded ? (
              <KeyboardDoubleArrowLeftIcon fontSize="small" sx={{ color: theme.palette.common.black }} />
            ) : (
              <KeyboardDoubleArrowRightIcon fontSize="small" sx={{ color: theme.palette.common.black }} />
            )}
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: {
                fontSize: '14px',
                color: theme.palette.common.black,
              },
            }}
            primary={t('content.common.collapseSidebar')}
            sx={{ opacity: open ? 1 : 0, display: !sidebarExpanded ? 'none' : 'flex' }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}
