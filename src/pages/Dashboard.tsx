/* eslint-disable @typescript-eslint/no-explicit-any */
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

import React, { SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

// components
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

// models
import { File } from '../models/File';

// utils
import { Help } from './Help';
import UploadHistory from './UploadHistory';
import CreateData from './CreateData';
import { Config } from '../utils/config';
import { ConsumeData } from './ConsumeData';
import ContractHistory from './ContractHistory';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setSelectedFiles, setUploadStatus } from '../store/providerSlice';
import PoliciesDialog from '../components/policies/PoliciesDialog';
import { setPageLoading } from '../store/appSlice';
import { Box, useTheme } from '@mui/material';
import { setSnackbarMessage } from '../store/Notifiication/slice';
import { Typography } from 'cx-portal-shared-components';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { selectedFiles } = useAppSelector(state => state.providerSlice);
  let dragCounter = 0;
  const dispatch = useAppDispatch();
  const handleExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  const handleFiles = (file: File) => {
    dispatch(setUploadStatus(false));
    dispatch(setPageLoading(false));
    const maxFileSize = parseInt(Config.REACT_APP_FILESIZE);
    if (file.size < maxFileSize) {
      dispatch(setSelectedFiles([file] as any));
    } else {
      dispatch(
        setSnackbarMessage({
          message: 'File not permitted!',
          type: 'error',
        }),
      );
    }
  };

  const dragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const dragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter > 0) return;
    setIsDragging(false);
  };

  const fileDrop = (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length && files.length < 2 && selectedFiles.length === 0) {
      handleFiles(files[0]);
      dispatch(setUploadStatus(false));
      dispatch(setPageLoading(false));
    } else if (files.length && files.length < 2 && selectedFiles.length > 0) {
      dispatch(setSelectedFiles([files[0]]));
      dispatch(setUploadStatus(false));
      dispatch(setPageLoading(false));
    } else {
      dispatch(
        setSnackbarMessage({
          message: 'nly one file is permitted',
          type: 'error',
        }),
      );
    }
    setIsDragging(false);
  };

  const layout = () => {
    switch (location.pathname) {
      case '/dashboard/create-data':
        return (
          <>
            <CreateData handleFiles={(files: any) => handleFiles(files)} />
            <PoliciesDialog />
          </>
        );
      case '/dashboard/history':
        return <UploadHistory />;
      case '/dashboard/help':
        return <Help />;
      case '/dashboard/consume-data':
        return <ConsumeData />;
      case '/dashboard/contract-history':
        return <ContractHistory />;
      default:
        break;
    }
  };
  return (
    <Box
      sx={{ my: 0, mx: 'auto', overflowY: 'auto', overflowX: 'hidden', height: '100vh' }}
      onDragOver={(e: SyntheticEvent) => e.preventDefault()}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
    >
      {!isDragging && (
        <Box>
          <Nav getIsExpanded={(expanded: boolean) => handleExpanded(expanded)} />
          <Box sx={{ display: 'flex', mt: 8, height: `calc(100vh - 64px)`, overflow: 'hidden' }}>
            <Sidebar isExpanded={isExpanded} />
            <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>{layout()}</Box>
          </Box>
        </Box>
      )}

      {isDragging && (
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
            <UploadFileOutlinedIcon style={{ fontSize: 60 }} sx={{ color: theme.palette.common.white }} />
            <Typography color="white" variant="h4">
              Drop it like it's hot :)
            </Typography>
            <Typography color="white" variant="body1">
              Upload your file by dropping it in this window
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
