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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '../../models/User';
import { fetchUseCases, fetchUserPermissions } from './actions';
import { IAppSlice } from './types';

const initialState: IAppSlice = {
  pageLoading: false,
  loggedInUser: {
    userName: '',
    name: '',
    email: '',
    roles: [],
    company: '',
    bpn: '',
    tenant: '',
    token: '',
    parsedToken: {},
  },
  permissions: [],
  useCases: [],
  sidebarExpanded: true,
  selectedUseCases: [],
};
export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    setLoggedInUser: (state, action: PayloadAction<IUser>) => {
      state.loggedInUser = action.payload;
    },
    setSidebarExpanded: state => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSelectedUseCases: (state, action: PayloadAction<string[]>) => {
      state.selectedUseCases = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserPermissions.pending, state => {
      state.pageLoading = true;
    });
    builder.addCase(fetchUserPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload;
      state.pageLoading = false;
    });
    builder.addCase(fetchUseCases.pending, state => {
      state.pageLoading = true;
    });
    builder.addCase(fetchUseCases.fulfilled, (state, action) => {
      state.useCases = action.payload;
      state.pageLoading = false;
    });
  },
});

export const { setPageLoading, setLoggedInUser, setSelectedUseCases, setSidebarExpanded } = appSlice.actions;
export default appSlice.reducer;
