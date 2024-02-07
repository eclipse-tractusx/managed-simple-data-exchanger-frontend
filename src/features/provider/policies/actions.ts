/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
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
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Status } from '../../../enums';
import { ProcessReport } from '../../../models/ProcessReport';
import ProviderService from '../../../services/ProviderService';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';
import { RootState } from '../../store';
import { clearRows } from '../submodels/slice';
import { removeSelectedFiles, setUploadData, setUploadStatus } from '../upload/slice';
import { handleDialogClose } from './slice';

const defaultUploadData: ProcessReport = {
  processId: '',
  referenceProcessId: '',
  csvType: '',
  numberOfItems: 0,
  numberOfCreatedItems: 0,
  numberOfUpdatedItems: 0,
  numberOfDeletedItems: 0,
  numberOfFailedItems: 0,
  numberOfSucceededItems: 0,
  status: Status.inProgress,
  startDate: '',
  endDate: undefined,
};

const clearUpload = createAsyncThunk('/clear-upload', async (arg, { dispatch }) => {
  dispatch(setPageLoading(false));
  dispatch(setUploadStatus(true));
  dispatch(clearRows());
  dispatch(handleDialogClose());
  dispatch(removeSelectedFiles());
});

const handleAlerts = createAsyncThunk('/handle-alerts', (data: ProcessReport, { dispatch }) => {
  if (data?.status === Status.completed && data?.numberOfFailedItems === 0) {
    dispatch(
      setSnackbarMessage({
        message: 'alerts.uploadSuccess',
        type: 'success',
      }),
    );
  } else if (data?.status === Status.completed && data?.numberOfFailedItems > 0) {
    dispatch(
      setSnackbarMessage({
        message: 'alerts.uploadWarning',
        type: 'error', //warning
      }),
    );
  } else {
    dispatch(
      setSnackbarMessage({
        message: 'alerts.uploadError',
        type: 'error',
      }),
    );
  }
});

const processingReport = createAsyncThunk('/process-report', async (arg: any, { dispatch }) => {
  dispatch(setUploadData(arg.data));
  if (arg?.data?.status !== Status.completed && arg?.data?.status !== Status.failed) {
    // if status !== 'COMPLETED' && status !== 'FAILED' -> repeat in interval with 2 seconds to refresh data
    const interval = setInterval(
      () =>
        ProviderService.getInstance()
          .getReportById(arg.processId)
          .then(result => {
            dispatch(setUploadData(result.data));
            if (result?.data?.status === Status.completed || result.data.status === Status.failed) {
              clearInterval(interval);
              dispatch(clearUpload());
              dispatch(handleAlerts(result.data));
            }
          }),
      2000,
    );
  } else {
    dispatch(clearUpload());
    dispatch(setUploadData(defaultUploadData));
    dispatch(handleAlerts(arg.data));
  }
});

// Get process id
const getProcessId = createAsyncThunk('/get-process-id', async (processId: string, { dispatch }) => {
  setTimeout(async () => {
    ProviderService.getInstance()
      .getReportById(processId)
      .then(response => {
        // if process id is ready - upload the data
        dispatch(processingReport({ response, processId }));
      })
      .catch(error => {
        // if process id not ready - repeat request
        if (error.response.status === 404) {
          dispatch(getProcessId(processId));
        }
      });
  }, 2000);
});

const uploadFileWithPolicy = createAsyncThunk('/upload-file-with-policy', async (data: any, { dispatch, getState }) => {
  const state = getState() as RootState;
  const formData = new FormData();
  formData.append('file', state.uploadFileSlice.selectedFiles[0]);
  formData.append('meta_data', JSON.stringify(data));
  formData.append('submodel', state.submodelSlice.selectedSubmodel.value);

  try {
    dispatch(setPageLoading(true));
    const response = await ProviderService.getInstance().uploadData(
      state.submodelSlice.selectedSubmodel.value,
      formData,
    );
    const uploadSubmodelData = response?.data;
    // first call
    if (uploadSubmodelData) dispatch(getProcessId(uploadSubmodelData));
  } catch (error) {
    dispatch(setUploadData({ ...state.uploadFileSlice.currentUploadData, status: Status.failed }));
    clearUpload();
  }
});

const uploadTableWithPolicy = createAsyncThunk(
  'upload-table-with-policy',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    try {
      dispatch(setPageLoading(true));
      const response = await ProviderService.getInstance().submitSubmodalData(
        state.submodelSlice.selectedSubmodel.value,
        data,
      );
      const submitSubmodelData = response?.data;
      if (submitSubmodelData) dispatch(getProcessId(submitSubmodelData));
    } catch (error: any) {
      dispatch(setUploadData({ ...state.uploadFileSlice.currentUploadData, status: Status.failed }));
      clearUpload();
    }
  },
);

export { uploadFileWithPolicy, uploadTableWithPolicy };
