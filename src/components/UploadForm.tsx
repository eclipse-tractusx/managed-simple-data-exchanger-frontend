/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

import { useRef } from 'react';
import { FileSize } from '../models/FileSize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAppDispatch, useAppSelector } from '../store/store';
import { removeSelectedFiles } from '../store/providerSlice';
import { Button, Typography } from 'cx-portal-shared-components';
import { Box, Link, useTheme } from '@mui/material';

// eslint-disable-next-line
const UploadForm = (props: any) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { selectedFiles, uploadStatus } = useAppSelector(state => state.providerSlice);

  const fileInputClicked = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const filesSelected = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      props.getSelectedFiles(fileInputRef.current.files[0]);
    }
  };

  const fileSize = (size: number) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes: string[] = Object.keys(FileSize);
    const i = Math.floor(Math.log(size) / Math.log(k));
    return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" marginBottom={3} textAlign="center">
        Upload a file
      </Typography>
      <Box
        sx={{
          border: '1px dashed lightgrey',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <input
          id="round"
          ref={fileInputRef}
          type="file"
          onClick={fileInputClicked}
          onChange={filesSelected}
          style={{ display: 'none' }}
          accept=".csv"
        />
        <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
        <Typography variant="body1" my={3} textAlign="center">
          Upload a fileDrag and drop your file on this page
        </Typography>
        <Typography variant="body1" mb={3} textAlign="center">
          or
        </Typography>

        <Button variant="outlined" size="small" onClick={fileInputClicked}>
          CHOOSE A FILE
        </Button>
      </Box>
      &nbsp;
      <Box>
        <Typography variant="subtitle1" mb={1} fontWeight={'bold'}>
          The upload must be performed in the following order:
        </Typography>
        <Typography variant="body1">1 - serialPartTypization.csv</Typography>
        <Typography variant="body1">2 - batch.csv</Typography>
        <Typography variant="body1">3 - assemblyPartRelationship.csv</Typography>
      </Box>
      {selectedFiles.length && !uploadStatus ? (
        <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
          <Typography variant="subtitle1" mb={2} fontWeight={'bold'}>
            Selected file
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, px: 2, background: 'lightgrey' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
              <UploadFileIcon />
              <Typography fontSize={16}>
                {selectedFiles[0].name} ({fileSize(selectedFiles[0].size)})
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
  );
};

export default UploadForm;
