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

import { GridColDef } from '@mui/x-data-grid';
import { Table, Tooltips, Typography } from 'cx-portal-shared-components';
import { capitalize } from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import DownloadHistoryErrorDialog from '../../components/dialogs/DownloadHistoryErrorDialog';
import PageHeading from '../../components/PageHeading';
import { Status } from '../../enums';
import { useOffersDownloadHistoryQuery } from '../../features/consumer/offersDownloadHistory/apiSlice';
import { MAX_CONTRACTS_AGREEMENTS } from '../../helpers/ConsumerOfferHelper';
import { IDefaultObject } from '../../models/Common';
import { ProcessReport } from '../../models/ProcessReport';
import { DATE_TIME_FORMAT, STATUS_COLOR_MAPPING } from '../../utils/constants';

function OffersDownloadHistory() {
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTableData, setErrorTableData] = useState<IDefaultObject[]>([]);

  const { data, isSuccess, isFetching, refetch } = useOffersDownloadHistoryQuery({
    pageSize: MAX_CONTRACTS_AGREEMENTS,
  });
  const handleErrorDialog = () => setShowErrorDialog(prev => !prev);
  const renderStatusCell = (row: ProcessReport) => {
    if (row.status === Status.failed) {
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
          View details
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

  const columns: GridColDef[] = [
    {
      field: 'processId',
      headerName: 'Process Id',
      minWidth: 200,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipText={row.processId}>
          <span>{row.processId}</span>
        </Tooltips>
      ),
    },
    {
      field: 'providerUrl',
      headerName: 'Provider URL',
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipText={row.providerUrl}>
          <span>{row.providerUrl}</span>
        </Tooltips>
      ),
    },
    {
      field: 'numberOfItems',
      headerName: 'Total items',
      flex: 1,
    },
    {
      field: 'downloadSuccessed',
      headerName: 'Success',
      flex: 1,
    },
    {
      field: 'downloadFailed',
      headerName: 'Failed',
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 200,
      flex: 1,
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
