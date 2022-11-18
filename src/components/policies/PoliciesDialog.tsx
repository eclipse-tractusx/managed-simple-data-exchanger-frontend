/********************************************************************************
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

import { Button, Dialog, DialogContent, DialogHeader, DialogActions } from 'cx-portal-shared-components';
import { useState, useEffect } from 'react';
import { Status, CsvTypes, ProcessReport } from '../../models/ProcessReport';
import DftService from '../../services/DftService';
import { handleDialogClose } from '../../features/policies/slice';
import { setPageLoading } from '../../store/appSlice';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { removeSelectedFiles, setUploadData, setUploadStatus } from '../../store/providerSlice';
import { useAppSelector, useAppDispatch } from '../../store/store';
import AccessPolicy from './AccessPolicy';
import UsagePolicy from './UsagePolicy';
import { clearRows } from '../../features/submodels/slice';

const defaultUploadData: ProcessReport = {
  processId: '',
  referenceProcessId: '',
  csvType: CsvTypes.unknown,
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

export default function PoliciesDialog() {
  const {
    openDialog,
    accessType,
    bpnList,
    companyBpn,
    uploadUrl,
    uploadData,
    uploadType,
    duration,
    durationValue,
    durationUnit,
    purpose,
    purposeValue,
    role,
    roleValue,
    custom,
    customValue,
  } = useAppSelector(state => state.accessUsagePolicySlice);
  const { currentUploadData, selectedFiles } = useAppSelector(state => state.providerSlice);
  const { selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const [showError, setshowError] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const durationCheck = duration === 'RESTRICTED' && durationValue === '';
    const purposeCheck = purpose === 'RESTRICTED' && purposeValue === '';
    const roleCheck = role === 'RESTRICTED' && roleValue === '';
    setshowError(() => durationCheck || purposeCheck || roleCheck);
    return () => {};
  }, [duration, durationValue, purpose, purposeValue, role, roleValue]);

  const clearUpload = () => {
    dispatch(setPageLoading(false));
    dispatch(setUploadStatus(true));
    dispatch(setPageLoading(false));
    dispatch(clearRows());
    dispatch(handleDialogClose());
  };

  const processingReport = (r: { data: ProcessReport }, processId: string) => {
    dispatch(setUploadData(r.data));
    if (r?.data?.status !== Status.completed && r?.data?.status !== Status.failed) {
      // if status !== 'COMPLETED' && status !== 'FAILED' -> set interval with 2 seconds to refresh data
      const interval = setInterval(
        () =>
          DftService.getInstance()
            .getReportById(processId)
            .then(result => {
              dispatch(setUploadData(result.data));
              if (result?.data?.status === Status.completed || result.data.status === Status.failed) {
                clearInterval(interval);
                clearUpload();
              }
            }),
        2000,
      );
    } else {
      clearUpload();
      dispatch(setUploadData(defaultUploadData));
      dispatch(removeSelectedFiles());
      if (r?.data?.status === Status.completed && r?.data?.numberOfFailedItems === 0) {
        dispatch(
          setSnackbarMessage({
            message: 'Upload completed!',
            type: 'success',
          }),
        );
      } else if (r?.data?.status === Status.completed && r?.data?.numberOfFailedItems > 0) {
        dispatch(
          setSnackbarMessage({
            message: 'Upload completed with warnings!',
            type: 'warning',
          }),
        );
      } else {
        dispatch(
          setSnackbarMessage({
            message: 'Upload failed!',
            type: 'error',
          }),
        );
      }
    }
  };

  const processingReportFirstCall = (processId: string) => {
    setTimeout(async () => {
      DftService.getInstance()
        .getReportById(processId)
        .then(response => {
          processingReport(response, processId);
        })
        .catch(error => {
          // if process id not ready - repeat request
          if (error.response.status === 404) {
            processingReportFirstCall(processId);
          } else {
            clearUpload();
          }
        });
    }, 2000);
  };

  const payload = {
    bpn_numbers: accessType === 'restricted' ? [companyBpn, ...bpnList] : [],
    type_of_access: accessType,
    row_data: uploadData,
    usage_policies: [
      {
        type: 'DURATION',
        typeOfAccess: duration,
        value: durationValue,
        durationUnit: durationUnit,
      },
      {
        type: 'ROLE',
        typeOfAccess: role,
        value: roleValue,
      },
      {
        type: 'PURPOSE',
        typeOfAccess: purpose,
        value: purposeValue,
      },
      {
        type: 'CUSTOM',
        typeOfAccess: custom,
        value: customValue,
      },
    ],
  };
  const submitData = async () => {
    try {
      dispatch(setPageLoading(true));
      const response = await DftService.getInstance().submitSubmodalData(uploadUrl, payload);
      // first call
      processingReportFirstCall(response.data);
    } catch (error) {
      dispatch(setUploadData({ ...currentUploadData, status: Status.failed }));
      clearUpload();
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    formData.append('meta_data', JSON.stringify(payload));

    try {
      dispatch(setPageLoading(true));
      const resp = await DftService.getInstance().uploadData(selectedSubmodel, formData);
      const processId = resp.data;
      // first call
      processingReportFirstCall(processId);
    } catch (error) {
      dispatch(setUploadData({ ...currentUploadData, status: Status.failed }));
      clearUpload();
    }
  };

  function handleSubmitData() {
    if (showError) return;
    switch (uploadType) {
      case 'file':
        uploadFile();
        break;
      case 'json':
        submitData();
        break;
      default:
        break;
    }
  }

  return (
    // Dialog width change is not available currently in cx-shared-components library
    <Dialog open={openDialog}>
      <DialogHeader closeWithIcon onCloseWithIcon={() => dispatch(handleDialogClose())} title="Policies" />
      <DialogContent>
        <AccessPolicy />
        <UsagePolicy />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => dispatch(handleDialogClose())}>
          Close
        </Button>
        <Button variant="contained" onClick={handleSubmitData}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
