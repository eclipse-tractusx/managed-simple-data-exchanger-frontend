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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PolicyModel } from '../../../models/RecurringUpload.models';
import { IAccessPolicyState } from './types';

const initialState: IAccessPolicyState = {
  openDialog: false,
  policyData: {} as PolicyModel,
  policyDialog: false,
  policyDialogType: '',
};

export const policySlice = createSlice({
  name: 'policySlice',
  initialState,
  reducers: {
    setPolicyData: (state, action: PayloadAction<PolicyModel>) => {
      state.policyData = new PolicyModel(action.payload);
    },
    setPolicyDialog: (state, action: PayloadAction<boolean>) => {
      state.policyDialog = action.payload;
    },
    setPolicyDialogType: (state, action: PayloadAction<string>) => {
      state.policyDialogType = action.payload;
    },
    handleDialogClose: state => Object.assign(state, initialState),
  },
});

export const { setPolicyData, setPolicyDialog, setPolicyDialogType, handleDialogClose } = policySlice.actions;

export default policySlice.reducer;
