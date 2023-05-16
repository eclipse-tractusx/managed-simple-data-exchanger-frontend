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

import { Box, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Table,
  Tooltips,
  Typography,
} from 'cx-portal-shared-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../features/store';
import { formatDate } from '../../utils/utils';

interface UploadHistoryErrorDialogProps {
  open: boolean;
  handleDialogClose?: () => void;
}

const UploadHistoryErrorDialog: React.FC<UploadHistoryErrorDialogProps> = ({ open = false, handleDialogClose }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const { errorsList, isLoading, currentProcessId } = useAppSelector(state => state.uploadHistorySlice);
  const handleClose = () => {
    handleDialogClose();
  };
  const columns: GridColDef[] = [
    {
      field: 'dateTime',
      headerName: 'Date',
      flex: 1.5,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={formatDate(row.dateTime)}>
          <span>{formatDate(row.dateTime)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'log',
      sortable: false,
      headerName: 'Error Log',
      flex: 5,
      align: 'center',
      headerAlign: 'center',
    },
  ];

  return (
    <Dialog
      open={open}
      additionalModalRootStyles={{
        width: '75%',
        maxHeight: '90%',
      }}
    >
      <DialogHeader closeWithIcon onCloseWithIcon={() => handleClose()} title={t('content.uploadHistory.errorLogs')} />
      <DialogContent dividers sx={{ py: 3 }}>
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} display={'flex'}>
              <Typography variant="h4">Process Id:</Typography>
              <Typography variant="subtitle1" ml={1}>
                {currentProcessId}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Table
              loading={isLoading}
              title={''}
              getRowId={row => row.uuid}
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableSelectionOnClick
              columns={columns}
              rows={errorsList}
              pageSize={pageSize}
              page={page}
              rowHeight={100}
              onPageChange={newPage => setPage(newPage)}
              rowsPerPageOptions={[10, 15, 20, 100]}
              sx={{
                '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
                  textOverflow: 'clip',
                  whiteSpace: 'break-spaces !important',
                  maxHeight: 'none !important',
                  lineHeight: 1.4,
                },
                '& .MuiBox-root': { display: 'none' },
              }}
            />
          </Box>
        </>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleClose()}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadHistoryErrorDialog;
