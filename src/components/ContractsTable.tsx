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
import { Refresh } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { LoadingButton } from 'cx-portal-shared-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetContractsQuery } from '../features/provider/contracts/apiSlice';
import { handleBlankCellValues, MAX_CONTRACTS_AGREEMENTS } from '../helpers/ConsumerOfferHelper';
import { convertEpochToDate } from '../utils/utils';

function ContractsTable({ type }: { type: string }) {
  const [pageSize, setPageSize] = useState<number>(10);
  const { t } = useTranslation();
  const HEADER_MAPPING: { [key: string]: string } = {
    PROVIDER: 'consumer',
    CONSUMER: 'provider',
  };
  const renderContractAgreementStatus = (params: GridRenderCellParams) => {
    switch (params.value) {
      case 'CONFIRMED':
        return (
          <Chip
            color="success"
            icon={<CheckCircleIcon fontSize="small" />}
            title={params.value}
            label={params.value}
            variant="outlined"
          />
        );
      case 'DECLINED':
        return (
          <Chip
            color="error"
            icon={<CancelIcon fontSize="small" />}
            title={params.value}
            label={params.value}
            variant="outlined"
          />
        );
      case 'ERROR':
        return (
          <Chip
            color="warning"
            icon={<ErrorIcon fontSize="small" />}
            title={params.value}
            label={params.value}
            variant="outlined"
          />
        );
      default:
        return <Chip color="default" title={params.value} label={params.value} variant="outlined" />;
    }
  };
  const columns: GridColDef[] = [
    {
      field: 'contractAgreementId',
      flex: 1,
      headerName: t('content.contractHistory.columns.contractAgreementId'),
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.contractAgreementId),
    },
    {
      field: 'contractAgreementInfo.assetId',
      flex: 1,
      headerName: t('content.contractHistory.columns.assetId'),
      valueGetter: (params: GridValueGetterParams) =>
        params.row.contractAgreementInfo ? params.row.contractAgreementInfo?.assetId : '-',
    },
    {
      field: 'counterPartyAddress',
      flex: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headerName: `${t(`pages.${HEADER_MAPPING[type]}`)} ${t('content.contractHistory.columns.counterPartyAddress')}`,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.counterPartyAddress),
    },
    {
      field: 'contractAgreementInfo.contractSigningDate',
      flex: 1,
      headerName: t('content.contractHistory.columns.contractSigningDate'),
      sortingOrder: ['asc', 'desc'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortComparator: (v1, v2, param1: any, param2: any) => param2.id - param1.id,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.contractAgreementInfo?.contractSigningDate
          ? convertEpochToDate(params.row.contractAgreementInfo.contractSigningDate)
          : '-',
    },
    {
      field: 'contractAgreementInfo.contractEndDate',
      flex: 1,
      headerName: t('content.contractHistory.columns.contractEndDate'),
      sortingOrder: ['asc', 'desc'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortComparator: (v1, v2, param1: any, param2: any) => param2.id - param1.id,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.contractAgreementInfo?.contractEndDate
          ? convertEpochToDate(params.row.contractAgreementInfo.contractEndDate)
          : '-',
    },
    {
      field: 'state',
      flex: 1,
      headerName: t('content.contractHistory.columns.state'),
      renderCell: renderContractAgreementStatus,
    },
  ];

  const handleTitle = () => {
    if (type === 'PROVIDER') {
      return t('content.providerContracts.title');
    } else {
      return t('content.consumerContracts.title');
    }
  };

  const { data, isLoading, isSuccess, refetch } = useGetContractsQuery({
    type: type,
    offset: 0,
    maxLimit: MAX_CONTRACTS_AGREEMENTS,
  });

  if (isSuccess) {
    return (
      <Box sx={{ flex: 1, p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} my={4}>
            <Typography variant="h3">{handleTitle()}</Typography>
            <Typography variant="body1">
              {t('content.common.ownConnector')} {data.connector}
            </Typography>
          </Grid>
          <Grid item xs={6} my={4} textAlign={'right'}>
            <LoadingButton
              size="small"
              variant="contained"
              label={t('button.refresh')}
              onButtonClick={() => refetch}
              startIcon={<Refresh />}
              loadIndicator={t('content.common.loading')}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
              <DataGrid
                sx={{ mt: 4 }}
                autoHeight={true}
                getRowId={row => row.negotiationId}
                rows={data.contracts}
                columns={columns}
                loading={isLoading}
                pagination
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                components={{
                  Toolbar: GridToolbar,
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  } else return null;
}

export default ContractsTable;
