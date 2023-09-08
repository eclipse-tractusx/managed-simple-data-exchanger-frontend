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
import { Refresh } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Grid, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridValidRowModel } from '@mui/x-data-grid';
import { IconButton, LoadingButton, Tooltips, Typography } from 'cx-portal-shared-components';
import { capitalize, find } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setPageLoading } from '../features/app/slice';
import { useDeleteContractMutation, useGetContractsQuery } from '../features/provider/contracts/apiSlice';
import { useAppDispatch } from '../features/store';
import { handleBlankCellValues, MAX_CONTRACTS_AGREEMENTS } from '../helpers/ConsumerOfferHelper';
import { IDefaultObject } from '../models/Common';
import { CONTRACT_STATES, DURATION_UNIT_MAPPING, STATUS_COLOR_MAPPING, USER_TYPE_SWITCH } from '../utils/constants';
import { convertEpochToDate, epochToDate } from '../utils/utils';
import NoDataPlaceholder from './NoDataPlaceholder';

interface IContractsTable {
  type: string;
  title: string;
  subtitle: string;
}
function ContractsTable({ type, title, subtitle }: IContractsTable) {
  const [pageSize, setPageSize] = useState<number>(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pageType = `pages.${USER_TYPE_SWITCH[type]}`; // to avoid nested template literals

  const renderContractAgreementStatus = (params: GridRenderCellParams) => (
    <Typography color={STATUS_COLOR_MAPPING[params.value]} variant="body2">
      {capitalize(params.value)}
    </Typography>
  );

  const { isLoading, data, isFetching, isSuccess, refetch } = useGetContractsQuery({
    type: type,
    params: {
      offset: 0,
      maxLimit: MAX_CONTRACTS_AGREEMENTS,
    },
  });

  const [deleteContract, { isLoading: isDeleting }] = useDeleteContractMutation({});

  function calculateEndDate(policies: IDefaultObject[], signingDate: number) {
    if (policies?.length) {
      const { durationUnit, value } = find(policies, e => e.type === 'DURATION');
      const startDate = epochToDate(signingDate);
      if (durationUnit) {
        return moment(startDate).add(value, Object(DURATION_UNIT_MAPPING)[durationUnit]).format('DD/MM/YYYY HH:mm:ss');
      } else return '-';
    } else return '-';
  }

  useEffect(() => {
    dispatch(setPageLoading(isLoading));
  }, [dispatch, isLoading, isDeleting]);

  const columns: GridColDef[] = [
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.contractHistory.columns.assetId'),
      valueGetter: ({ row }) => row.contractAgreementInfo,
      valueFormatter: ({ value }) => value?.assetId,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={row?.contractAgreementInfo?.assetId}>
          <span>{handleBlankCellValues(row?.contractAgreementInfo?.assetId)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'counterPartyAddress',
      flex: 1,
      minWidth: 250,
      headerName: `${t(pageType)} ${t('content.contractHistory.columns.counterPartyAddress')}`,
      renderCell: ({ row }) => (
        <Tooltips
          tooltipPlacement="top-start"
          tooltipArrow={false}
          tooltipText={handleBlankCellValues(row.counterPartyAddress)}
        >
          <span>{handleBlankCellValues(row.counterPartyAddress)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'contractSigningDate',
      flex: 1,
      headerName: t('content.contractHistory.columns.contractSigningDate'),
      sortingOrder: ['asc', 'desc'],
      sortComparator: (v1, v2, param1: GridValidRowModel, param2: GridValidRowModel) => param2.id - param1.id,
      valueGetter: ({ row }) => row.contractAgreementInfo,
      valueFormatter: ({ value }) => convertEpochToDate(value?.contractSigningDate),
      renderCell: ({ row }) =>
        row.contractAgreementInfo?.contractSigningDate ? (
          <Tooltips
            tooltipPlacement="top"
            tooltipText={convertEpochToDate(row.contractAgreementInfo?.contractSigningDate)}
          >
            <span>{convertEpochToDate(row.contractAgreementInfo?.contractSigningDate)}</span>
          </Tooltips>
        ) : (
          '-'
        ),
    },
    {
      field: 'contractEndDate',
      flex: 1,
      headerName: t('content.contractHistory.columns.contractEndDate'),
      sortingOrder: ['asc', 'desc'],
      sortComparator: (v1, v2, param1: GridValidRowModel, param2: GridValidRowModel) => param2.id - param1.id,
      valueGetter: ({ row }) => row.contractAgreementInfo,
      valueFormatter: ({ value }) => calculateEndDate(value?.policies, value?.contractSigningDate),
      renderCell: ({ row }) => (
        <Tooltips
          tooltipPlacement="top"
          tooltipText={calculateEndDate(
            row.contractAgreementInfo?.policies,
            row.contractAgreementInfo?.contractSigningDate,
          )}
        >
          <span>
            {calculateEndDate(row.contractAgreementInfo?.policies, row.contractAgreementInfo?.contractSigningDate)}
          </span>
        </Tooltips>
      ),
    },
    {
      field: 'state',
      flex: 1,
      headerName: t('content.contractHistory.columns.state'),
      renderCell: renderContractAgreementStatus,
    },
  ];

  const actionCol: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      maxWidth: 80,
      sortable: false,
      disableExport: true,
      renderCell: ({ row }) => {
        const checkState = CONTRACT_STATES.some(e => e === row.state);
        if (!checkState) {
          return (
            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.declineContract')}>
              <span>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => deleteContract({ negotiationId: row.negotiationId, type })}
                  sx={{ mr: 2 }}
                >
                  <CancelIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
          );
        }
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body1" mt={1}>
              {subtitle}
            </Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
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
          <Grid item xs={12}>
            <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
              <Typography variant="body1" maxWidth={900} mb={2}>
                {t('content.common.ownConnector')} {data.connector}
              </Typography>
              <DataGrid
                autoHeight={true}
                getRowId={row => row.id}
                rows={data.contracts}
                columns={type === 'provider' ? [...columns, ...actionCol] : columns}
                loading={isFetching}
                pagination
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                components={{
                  Toolbar: GridToolbar,
                  LoadingOverlay: LinearProgress,
                  NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
                  NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaderTitle': {
                    textOverflow: 'clip',
                    whiteSpace: 'break-spaces !important',
                    maxHeight: 'none !important',
                    lineHeight: 1.4,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  } else return null;
}

export default ContractsTable;
