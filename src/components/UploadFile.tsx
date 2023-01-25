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
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Link, useTheme } from '@mui/material';
import { Button, Typography } from 'cx-portal-shared-components';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { setPageLoading } from '../features/app/slice';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { handleDialogOpen } from '../features/policies/slice';
import { FileSize } from '../models/FileSize';
import { removeSelectedFiles, setSelectedFiles, setUploadStatus } from '../store/providerSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Config } from '../utils/config';
import { trimText } from '../utils/utils';

export default function UploadFile() {
  const { selectedFiles, uploadStatus } = useAppSelector(state => state.providerSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const theme = useTheme();

  const handleFiles = (file: File) => {
    dispatch(setUploadStatus(false));
    dispatch(setPageLoading(false));
    const maxFileSize = parseInt(Config.REACT_APP_FILESIZE);
    if (file.size < maxFileSize) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(setSelectedFiles(file));
    } else {
      dispatch(
        setSnackbarMessage({
          message: t('alerts.invalidFile'),
          type: 'error',
        }),
      );
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    handleFiles(acceptedFiles[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
          disabled={!Boolean(selectedFiles.length)}
          size="small"
          variant="contained"
          onClick={() => dispatch(handleDialogOpen({ type: 'file' }))}
        >
          {t('content.policies.configure')}
        </Button>
      </Box>
      <Box sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" marginBottom={3} textAlign="center">
            {t('content.provider.uploadFile')}
          </Typography>
          <Box
            sx={{
              border: '1px dashed lightgrey',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
              position: 'relative',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
            <Typography variant="body1" my={3} textAlign="center">
              {t('content.provider.uploadInstruction')}
            </Typography>
            <Typography variant="body1" mb={3} textAlign="center">
              {t('content.common.or')}
            </Typography>
            <Button variant="outlined" size="small">
              {t('button.chooseFile')}
            </Button>

            {isDragActive ? (
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: theme.palette.primary.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon style={{ fontSize: 40 }} sx={{ color: theme.palette.common.white }} />
                  <Typography color="white" variant="h4">
                    {t('content.provider.dropFile')}
                  </Typography>
                  <Typography color="white" variant="body1">
                    {t('content.provider.dropInstruction')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              ''
            )}
          </Box>
          {selectedFiles.length && !uploadStatus ? (
            <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
              <Typography variant="subtitle1" mb={2} fontWeight={'bold'}>
                {t('content.provider.selectedFile')}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, px: 2, background: 'lightgrey' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                  <UploadFileIcon />
                  <Typography fontSize={16}>
                    {trimText(selectedFiles[0].name, 20)} ({fileSize(selectedFiles[0].size)})
                  </Typography>
                </Box>
                <Link sx={{ color: 'black' }} onClick={() => dispatch(removeSelectedFiles())}>
                  <CloseIcon />
                </Link>
              </Box>
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </>
  );
}
