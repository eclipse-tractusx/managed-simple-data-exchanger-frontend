/********************************************************************************
 * Copyright (c) 2023,2024 T-Systems International GmbH
 * Copyright (c) 2023,2024 Contributors to the Eclipse Foundation
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

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, LinearProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Button, IconButton, Table, Tooltips, Typography } from 'cx-portal-shared-components';
import { filter, map } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import NoDataPlaceholder from '../components/NoDataPlaceholder';
import AddEditPolicy from '../components/policies/AddEditPolicy';
import SelectedUseCases from '../components/SelectedUseCases';
import { useDeletePolicyMutation, useGetPoliciesQuery } from '../features/provider/policies/apiSlice';
import { setPolicyData, setPolicyDialog, setPolicyDialogType } from '../features/provider/policies/slice';
import { PolicyHubResponse } from '../features/provider/policies/types';
import { useAppDispatch } from '../features/store';

function Policies() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Get
  const { data, isSuccess, isFetching } = useGetPoliciesQuery({
    pageSize: pageSize,
    page: page,
  });

  // Delete
  const [deletePolicy] = useDeletePolicyMutation();

  const showAvailablePolicies = (policies: PolicyHubResponse[]) => {
    const nonEmptyValues = filter(policies, policy => policy.value[0]);
    const technicalKeys = map(nonEmptyValues, 'technicalKey').join(', ');
    return technicalKeys || 'Not available';
  };

  const columns: GridColDef[] = [
    {
      field: 'policy_name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
    },
    {
      field: 'Access',
      headerName: 'Access Policies',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Tooltips tooltipPlacement="bottom" tooltipText={showAvailablePolicies(row.Access)}>
            <span>{showAvailablePolicies(row.Access)}</span>
          </Tooltips>
        );
      },
    },
    {
      field: 'Usage',
      headerName: 'Usage Policies',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Tooltips tooltipPlacement="bottom-start" tooltipText={showAvailablePolicies(row.Usage)}>
            <span>{showAvailablePolicies(row.Usage)}</span>
          </Tooltips>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <Tooltips tooltipPlacement="bottom" tooltipText="Edit">
              <span>
                <IconButton
                  aria-label="edit"
                  size="small"
                  sx={{ mr: 3 }}
                  onClick={() => {
                    dispatch(setPolicyDialogType('Edit'));
                    dispatch(setPolicyData(row));
                    dispatch(setPolicyDialog(true));
                  }}
                >
                  <EditIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
            <Tooltips tooltipPlacement="bottom" tooltipText="Delete">
              <span>
                <IconButton aria-label="delete" size="small" onClick={() => deletePolicy(row.uuid)}>
                  <DeleteIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
          </>
        );
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Grid container spacing={2} alignItems="center" mb={4}>
          <Grid item xs={10}>
            <Typography variant="h3" mb={1}>
              {t('content.policies.title')}
            </Typography>
            <SelectedUseCases />
            <Typography variant="body1">{t('content.policies.subtitle')}</Typography>
            <ul style={{ margin: 0, marginTop: '10px' }}>
              {[1, 2].map(e => (
                <li key={e}>
                  <Typography variant="body2">{t(`content.policies.page_description_${e}`)}</Typography>
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={2} display={'flex'} justifyContent={'flex-end'}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                dispatch(setPolicyDialogType('Add'));
                dispatch(setPolicyDialog(true));
              }}
            >
              {t('content.policies.addPolicy')}
            </Button>
          </Grid>
        </Grid>
        <Box>
          <Table
            title=""
            loading={isFetching}
            rowCount={data.totalItems}
            getRowId={row => row.uuid}
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            columns={columns}
            paginationMode="server"
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
        </Box>
        <AddEditPolicy />
      </>
    );
  } else return null;
}

export default Policies;
