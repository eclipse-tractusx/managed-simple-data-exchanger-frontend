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
import {
  HighlightOffOutlined,
  HourglassEmptyOutlined,
  Refresh,
  ReportGmailerrorredOutlined,
} from '@mui/icons-material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconButton, LoadingButton, Table, Tooltips, Typography } from 'cx-portal-shared-components';
import { t } from 'i18next';
import { useState } from 'react';

import Permissions from '../components/Permissions';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { useDeleteHistoryMutation, useGetHistoryQuery } from '../features/provider/history/apiSlice';
import { useAppDispatch } from '../features/store';
import { MAX_CONTRACTS_AGREEMENTS } from '../helpers/ConsumerOfferHelper';
import { ProcessReport, Status } from '../models/ProcessReport';
import AppService from '../services/appService';
import { formatDate } from '../utils/utils';
function UploadHistoryNew() {
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const dispatch = useAppDispatch();

  const { data, isSuccess, isFetching, refetch } = useGetHistoryQuery({ pageSize: MAX_CONTRACTS_AGREEMENTS });
  const [deleteHistory] = useDeleteHistoryMutation();
  const deleteSubmodal = async (subModel: ProcessReport) => {
    try {
      await deleteHistory(subModel);
    } catch (error) {
      console.log(error);
    }
  };

  async function download(subModel: ProcessReport) {
    try {
      const { csvType, processId } = subModel;
      const response = await AppService.getInstance().downloadHistory(csvType, processId);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${csvType}-${processId}.csv`);
        document.body.appendChild(link);
        link.click();
        dispatch(
          setSnackbarMessage({
            message: 'alerts.downloadSuccess',
            type: 'success',
          }),
        );
      }
    } catch (error) {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.downloadError',
          type: 'error',
        }),
      );
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'processId',
      headerName: 'Process Id',
      minWidth: 300,
      flex: 1,
      renderCell: ({ row }) => (
        <div>
          {row.referenceProcessId ? (
            <Tooltips
              tooltipPlacement="top-start"
              tooltipText={`${row.processId} (Deletion of ${row.referenceProcessId})`}
            >
              <div>
                {row.processId} (Deletion of <span style={{ color: 'red' }}>{row.referenceProcessId}</span>)
              </div>
            </Tooltips>
          ) : (
            <Tooltips tooltipPlacement="top-start" tooltipText={row.processId}>
              <div>{row.processId}</div>
            </Tooltips>
          )}
        </div>
      ),
    },
    {
      field: 'csvType',
      headerName: 'CSV Type',
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipText={row.csvType}>
          <span>{row.csvType}</span>
        </Tooltips>
      ),
    },
    {
      field: 'numberOfSucceededItems',
      headerName: 'Created Items',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'numberOfUpdatedItems',
      headerName: 'Updated Items',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'numberOfDeletedItems',
      headerName: 'Deleted Items',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'numberOfFailedItems',
      headerName: 'Failed Items',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <>
          {row.status === Status.completed && row.numberOfFailedItems === 0 && (
            <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
          )}
          {row.status === Status.completed && row.numberOfFailedItems > 0 && (
            <ReportGmailerrorredOutlined fontSize="small" color="warning" />
          )}
          {row.status === Status.failed && <HighlightOffOutlined fontSize="small" color="error" />}
          {row.status === Status.inProgress && <HourglassEmptyOutlined fontSize="small" color="info" />}
        </>
      ),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={formatDate(row.startDate)}>
          <span>{formatDate(row.startDate)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <Permissions values={['provider_delete_contract_offer']}>
              {row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                <Tooltips tooltipPlacement="bottom" tooltipText="Delete">
                  <span>
                    <IconButton aria-label="delete" size="small" onClick={() => deleteSubmodal(row)} sx={{ mr: 2 }}>
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltips>
              )}
            </Permissions>
            <Permissions values={['provider_download_own_data']}>
              {row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                <Tooltips tooltipPlacement="bottom" tooltipText="Download">
                  <span>
                    <IconButton aria-label="delete" size="small" onClick={() => download(row)}>
                      <DownloadIcon color="primary" fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltips>
              )}
            </Permissions>
          </>
        );
      },
    },
  ];

  if (isSuccess) {
    return (
      <Box sx={{ flex: 1, p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h3">{t('pages.uploadHistory')}</Typography>
          </Grid>
          <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton
              size="small"
              variant="contained"
              label={t('button.refresh')}
              onButtonClick={refetch}
              startIcon={<Refresh />}
              loadIndicator={t('content.common.loading')}
              loading={isFetching}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Table
            loading={isFetching}
            rowCount={data.totalItems}
            title={''}
            getRowId={row => row.processId}
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            columns={columns}
            rows={data.items}
            pageSize={pageSize}
            page={page}
            rowHeight={100}
            onPageChange={setPage}
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
      </Box>
    );
  } else return null;
}

export default UploadHistoryNew;
