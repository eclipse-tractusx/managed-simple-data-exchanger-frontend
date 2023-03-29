/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
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
import { Box } from '@mui/material';
import { useEffect } from 'react';

import { fetchUserPermissions } from '../../features/app/actions';
import { setLoggedInUser } from '../../features/app/slice';
import { useAppDispatch } from '../../features/store';
import Nav from '../Nav';
import Sidebar from '../sidebar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AppLayout(props: any) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserPermissions());
    dispatch(setLoggedInUser(props.loggedUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ my: 0, mx: 'auto', overflowY: 'auto', overflowX: 'hidden', height: '100vh' }}>
      <Box>
        <Nav />
        <Box sx={{ display: 'flex', mt: 8, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
