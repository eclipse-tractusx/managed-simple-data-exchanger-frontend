/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Button, Dialog, DialogActions, DialogContent, DialogHeader } from 'cx-portal-shared-components';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Status } from '../../enums';
import { setPageLoading } from '../../features/app/slice';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { handleDialogClose } from '../../features/provider/policies/slice';
import { clearRows } from '../../features/provider/submodels/slice';
import { removeSelectedFiles, setUploadData, setUploadStatus } from '../../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { ProcessReport } from '../../models/ProcessReport';
import ProviderService from '../../services/ProviderService';
import AccessPolicy from './AccessPolicy';
import UsagePolicy from './UsagePolicy';

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
  const { currentUploadData, selectedFiles } = useAppSelector(state => state.uploadFileSlice);
  const { selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const [showError, setshowError] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const durationCheck = duration === 'RESTRICTED' && durationValue === '';
    const purposeCheck = purpose === 'RESTRICTED' && _.isEmpty(purposeValue);
    const roleCheck = role === 'RESTRICTED' && roleValue === '';
    const customCheck = custom === 'RESTRICTED' && customValue === '';
    setshowError(() => durationCheck || purposeCheck || roleCheck || customCheck);
    return () => {};
  }, [duration, durationValue, purpose, purposeValue, role, roleValue, custom, customValue]);

  const clearUpload = () => {
    dispatch(setPageLoading(false));
    dispatch(setUploadStatus(true));
    dispatch(clearRows());
    dispatch(handleDialogClose());
    dispatch(removeSelectedFiles());
  };

  const handleAlerts = (res: { data: ProcessReport }) => {
    if (res?.data?.status === Status.completed && res?.data?.numberOfFailedItems === 0) {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.uploadSuccess',
          type: 'success',
        }),
      );
    } else if (res?.data?.status === Status.completed && res?.data?.numberOfFailedItems > 0) {
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
  };

  const processingReport = (r: { data: ProcessReport }, processId: string) => {
    dispatch(setUploadData(r.data));
    if (r?.data?.status !== Status.completed && r?.data?.status !== Status.failed) {
      // if status !== 'COMPLETED' && status !== 'FAILED' -> repeat in interval with 2 seconds to refresh data
      const interval = setInterval(
        () =>
          ProviderService.getInstance()
            .getReportById(processId)
            .then(result => {
              dispatch(setUploadData(result.data));
              if (result?.data?.status === Status.completed || result.data.status === Status.failed) {
                clearInterval(interval);
                clearUpload();
                handleAlerts(result);
              }
            }),
        2000,
      );
    } else {
      clearUpload();
      dispatch(setUploadData(defaultUploadData));
      handleAlerts(r);
    }
  };

  // Generate process id
  const processingReportFirstCall = (processId: string) => {
    setTimeout(async () => {
      ProviderService.getInstance()
        .getReportById(processId)
        .then(response => {
          // if process id is ready - upload the data
          processingReport(response, processId);
        })
        .catch(error => {
          // if process id not ready - repeat request
          if (error.response.status === 404) {
            processingReportFirstCall(processId);
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
        value: purposeValue.value,
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
      const response = await ProviderService.getInstance().submitSubmodalData(uploadUrl, payload);
      const submitSubmodelData = response?.data;
      if (submitSubmodelData) processingReportFirstCall(submitSubmodelData);
    } catch (error: any) {
      dispatch(setUploadData({ ...currentUploadData, status: Status.failed }));
      clearUpload();
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    formData.append('meta_data', JSON.stringify(payload));
    formData.append('submodel', selectedSubmodel.value);

    try {
      dispatch(setPageLoading(true));
      const response = await ProviderService.getInstance().uploadData(selectedSubmodel.value, formData);
      const uploadSubmodelData = response?.data;
      // first call
      if (uploadSubmodelData) processingReportFirstCall(uploadSubmodelData);
    } catch (error: any) {
      dispatch(setUploadData({ ...currentUploadData, status: Status.failed }));
      clearUpload();
    }
  };

  async function handleSubmitData() {
    if (showError) return;
    switch (uploadType) {
      case 'file':
        await uploadFile();
        break;
      case 'json':
        await submitData();
        break;
      default:
        break;
    }
  }

  return (
    // Dialog width change is not available currently in cx-shared-components library
    <Dialog open={openDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(handleDialogClose())}
        title={t('content.policies.title')}
      />
      <DialogContent>
        <AccessPolicy />
        <UsagePolicy />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => dispatch(handleDialogClose())}>
          {t('button.close')}
        </Button>
        <Button variant="contained" onClick={handleSubmitData} disabled={showError}>
          {t('button.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
