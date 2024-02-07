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
import { Box } from '@mui/material';
import { Button, DropArea, DropPreview, UploadStatus } from 'cx-portal-shared-components';
import { isEqual } from 'lodash';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { FileSize, FileType } from '../enums';
import { setPageLoading } from '../features/app/slice';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { setPolicyData, setPolicyDialog, setPolicyDialogType } from '../features/provider/policies/slice';
import { removeSelectedFiles, setSelectedFiles, setUploadStatus } from '../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { Config } from '../utils/config';
import { DEFAULT_POLICY_DATA } from '../utils/constants';
import { trimText } from '../utils/utils';
import InfoSteps from './InfoSteps';

export default function UploadFile() {
  const { selectedFiles, uploadStatus } = useAppSelector(state => state.uploadFileSlice);
  const { row } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  function csvValidation(file: File) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      // Access to content with e.target.result
      const fileData: any = e.target.result;
      // seperate header from first row and columns from rest all
      const [header] = fileData.split('\n').map((item: any) => item.trim().split(';'));
      const validateHeaders = isEqual(header, Object.keys(row));
      if (validateHeaders) dispatch(setSelectedFiles(file));
      else dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.incorrectColumns' }));
    };
    reader.readAsText(file);
  }

  const handleFiles = (file: File) => {
    dispatch(setUploadStatus(false));
    dispatch(setPageLoading(false));
    const maxFileSize = parseInt(Config.REACT_APP_FILESIZE);
    if (file.size < maxFileSize) {
      if (file.type === FileType.csv) csvValidation(file);
      else
        dispatch(
          setSnackbarMessage({
            message: 'alerts.invalidFile',
            type: 'error',
          }),
        );
    } else {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.largeFile',
          type: 'error',
        }),
      );
    }
  };

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.invalidFile' }));
    else handleFiles(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  const fileSize = (size: number) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes: string[] = Object.keys(FileSize);
    const i = Math.floor(Math.log(size) / Math.log(k));
    return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '100%',
          height: '100%',
        }}
      >
        <Button
          disabled={!selectedFiles.length}
          size="small"
          variant="contained"
          onClick={() => {
            dispatch(setPolicyDialogType('FileWithPolicy'));
            dispatch(setPolicyData(DEFAULT_POLICY_DATA));
            dispatch(setPolicyDialog(true));
          }}
        >
          {t('content.policies.configure')}
        </Button>
      </Box>
      <Box sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box {...getRootProps()}>
            <input {...getInputProps()} />
            <DropArea
              translations={{
                title: t('content.dropzone.title'),
                subTitle: t('content.dropzone.subTitle'),
                errorTitle: t('content.dropzone.errorTitle'),
              }}
            />
          </Box>
          {selectedFiles.length && !uploadStatus ? (
            <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
              <DropPreview
                onDelete={() => dispatch(removeSelectedFiles())}
                translations={{
                  placeholder: '',
                  uploadError: '',
                  uploadProgess: t('content.provider.uploadedFile'),
                  uploadSuccess: '',
                }}
                uploadFiles={[
                  {
                    name: trimText(selectedFiles[0].name, 20),
                    size: parseInt(fileSize(selectedFiles[0].size), 10),
                    status: UploadStatus.NEW,
                  },
                ]}
              />
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
      <InfoSteps icon="info" steps={['content.provider.uploadStep_1', 'content.provider.uploadStep_2']} />
    </>
  );
}
