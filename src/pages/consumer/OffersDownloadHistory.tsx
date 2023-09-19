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

import DownloadIcon from '@mui/icons-material/Download';
import { LinearProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconButton, Table, Tooltips, Typography } from 'cx-portal-shared-components';
import saveAs from 'file-saver';
import { capitalize } from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import DownloadHistoryErrorDialog from '../../components/dialogs/DownloadHistoryErrorDialog';
import NoDataPlaceholder from '../../components/NoDataPlaceholder';
import PageHeading from '../../components/PageHeading';
import Permissions from '../../components/Permissions';
import { setPageLoading } from '../../features/app/slice';
import { useOffersDownloadHistoryQuery } from '../../features/consumer/offersDownloadHistory/apiSlice';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { useAppDispatch } from '../../features/store';
import { MAX_CONTRACTS_AGREEMENTS } from '../../helpers/ConsumerOfferHelper';
import { IDefaultObject } from '../../models/Common';
import { ProcessReport } from '../../models/ProcessReport';
import ConsumerService from '../../services/ConsumerService';
import { DATE_TIME_FORMAT, STATUS_COLOR_MAPPING } from '../../utils/constants';

function OffersDownloadHistory() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTableData, setErrorTableData] = useState<IDefaultObject[]>([]);

  const { data, isSuccess, isFetching, refetch } = useOffersDownloadHistoryQuery({
    pageSize: MAX_CONTRACTS_AGREEMENTS,
  });
  const dispatch = useAppDispatch();

  const handleErrorDialog = () => setShowErrorDialog(prev => !prev);
  const renderStatusCell = (row: ProcessReport) => {
    if (row.downloadFailed > 0) {
      return (
        <Typography
          color={STATUS_COLOR_MAPPING.ERROR}
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => {
            setErrorTableData(row.offers);
            handleErrorDialog();
          }}
        >
          View errors
        </Typography>
      );
    } else {
      return (
        <Typography color={STATUS_COLOR_MAPPING[row.status]} variant="body2">
          {capitalize(row.status)}
        </Typography>
      );
    }
  };
  async function download({ processId }: Partial<ProcessReport>) {
    dispatch(setPageLoading(true));
    await ConsumerService.getInstance()
      .downloadDataOffers({ processId })
      .then(async response => {
        if (response.status === 200) {
          saveAs(new Blob([response.data]), 'data-offer.zip');
          dispatch(
            setSnackbarMessage({
              message: 'alerts.downloadSuccess',
              type: 'success',
            }),
          );
          await refetch();
        }
      })
      .catch(async error => console.log(error))
      .finally(() => dispatch(setPageLoading(false)));
  }

  const columns: GridColDef[] = [
    {
      field: 'processId',
      headerName: 'Process Id',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          {row.referenceProcessId ? (
            <Tooltips
              tooltipPlacement="top-start"
              tooltipArrow={false}
              tooltipText={`${row.processId} (Downloaded from ${row.referenceProcessId})`}
            >
              <span>
                {row.processId} (Downloaded from <span style={{ color: 'red' }}>{row.referenceProcessId}</span>)
              </span>
            </Tooltips>
          ) : (
            <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={row.processId}>
              <span>{row.processId}</span>
            </Tooltips>
          )}
        </>
      ),
    },
    {
      field: 'providerUrl',
      headerName: 'Provider URL',
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={row.providerUrl}>
          <span>{row.providerUrl}</span>
        </Tooltips>
      ),
    },
    {
      field: 'numberOfItems',
      headerName: 'Total items',
      flex: 1,
      sortable: false,
    },
    {
      field: 'downloadSuccessed',
      headerName: 'Success',
      flex: 1,
      sortable: false,
    },
    {
      field: 'downloadFailed',
      headerName: 'Failed',
      flex: 1,
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={moment(row.startDate).format(DATE_TIME_FORMAT)}>
          <span>{moment(row.startDate).format(DATE_TIME_FORMAT)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={moment(row.endDate).format(DATE_TIME_FORMAT)}>
          <span>{moment(row.endDate).format(DATE_TIME_FORMAT)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => renderStatusCell(row),
    },
    {
      field: 'actions',
      headerName: '',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Permissions values={['consumer_download_data_offer']}>
            <Tooltips tooltipPlacement="bottom" tooltipText="Download">
              <span>
                <IconButton aria-label="download" size="small" onClick={() => download(row)}>
                  <DownloadIcon color="primary" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
          </Permissions>
        );
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <PageHeading
          refetch={refetch}
          isFetching={isFetching}
          title="pages.offerDownloadHistory"
          description="content.offerDownloadHistory.description"
          showRefresh={true}
        />
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
          onPageSizeChange={setPageSize}
          page={page}
          onPageChange={setPage}
          rowsPerPageOptions={[10, 15, 20, 100]}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textOverflow: 'clip',
              whiteSpace: 'break-spaces !important',
              maxHeight: 'none !important',
              lineHeight: 1.4,
            },
            '& .MuiBox-root': { display: 'none' },
          }}
          components={{
            LoadingOverlay: LinearProgress,
            NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
            NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
          }}
        />
        <DownloadHistoryErrorDialog
          open={showErrorDialog}
          errorTableData={errorTableData}
          handleDialogClose={handleErrorDialog}
        />
      </>
    );
  } else return null;
}

export default OffersDownloadHistory;
