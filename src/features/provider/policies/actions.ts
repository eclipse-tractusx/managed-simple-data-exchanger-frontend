/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { omit } from 'lodash';

import { PolicyHubModel } from '../../../models/Polices.models';
import ProviderService from '../../../services/ProviderService';
import { setSnackbarMessage } from '../../notifiication/slice';
import { RootState } from '../../store';
import { clearRows } from '../submodels/slice';
import { removeSelectedFiles } from '../upload/slice';
import { handleDialogClose, setPolicyFormData } from './slice';
import { PolicyHubResponse } from './types';

const clearUpload = createAsyncThunk('/clear-upload', (_arg, { dispatch }) => {
  dispatch(clearRows());
  dispatch(handleDialogClose());
  dispatch(removeSelectedFiles());
  dispatch(
    setSnackbarMessage({
      message: 'alerts.uploadSuccess',
      type: 'success',
    }),
  );
});

const uploadFileWithPolicy = createAsyncThunk('/upload-file-with-policy', async (data: any, { dispatch, getState }) => {
  const state = getState() as RootState;
  const { selectedFiles } = state.uploadFileSlice;
  const { selectedSubmodel } = state.submodelSlice;

  const formData = new FormData();
  formData.append('file', selectedFiles[0]);
  formData.append('meta_data', JSON.stringify({ ...omit(data, 'lastUpdatedTime'), type: 'NEW' }));

  try {
    await ProviderService.getInstance()
      .uploadData(selectedSubmodel.value, formData)
      .then(res => {
        if (res) {
          dispatch(clearUpload());
        } else {
          dispatch(
            setSnackbarMessage({
              message: 'alerts.uploadError',
              type: 'error',
            }),
          );
        }
      });
  } catch (error) {
    console.log(error);
  }
});

const uploadTableWithPolicy = createAsyncThunk(
  'upload-table-with-policy',
  async (formData: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { selectedSubmodel, rows } = state.submodelSlice;

    try {
      await ProviderService.getInstance()
        .submitSubmodalData(selectedSubmodel.value, {
          ...omit(formData, 'lastUpdatedTime'),
          row_data: rows,
          type: 'NEW',
        })
        .then(res => {
          if (res) {
            dispatch(clearUpload());
          } else {
            dispatch(
              setSnackbarMessage({
                message: 'alerts.uploadError',
                type: 'error',
              }),
            );
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  },
);

const prepareFormData = createAsyncThunk(
  'transform-policy-hub-data',
  ({ data, edit }: { data: PolicyHubResponse[]; edit?: boolean }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { selectedUseCases } = state.appSlice;
    const { policyData, policyDialogType } = state.policySlice;
    const isEdit = policyDialogType === 'Edit';
    if (isEdit || edit) {
      dispatch(setPolicyFormData(PolicyHubModel.prepareEditData(policyData, data)));
    } else {
      dispatch(setPolicyFormData(PolicyHubModel.usecaseFilter(data, selectedUseCases)));
    }
  },
);

export { prepareFormData, uploadFileWithPolicy, uploadTableWithPolicy };
