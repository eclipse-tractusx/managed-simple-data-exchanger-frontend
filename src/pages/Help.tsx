/*********************************************************************************
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

import InfoIcon from '@mui/icons-material/Info';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Table, Tooltips, Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import DownloadCSV from '../components/DownloadCSV';
import { useGetHelpPageDataQuery } from '../features/provider/submodels/apiSlice';
import { HelpPageData } from '../features/provider/submodels/types';
import { useAppSelector } from '../features/store';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, sortable: false, align: 'left', disableColumnMenu: true },
  {
    field: 'mandatory',
    headerName: 'Mandatory',
    flex: 1,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    disableColumnMenu: true,
  },
  {
    field: 'order',
    headerName: 'Order',
    flex: 1,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    disableColumnMenu: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    disableColumnMenu: true,
    renderCell: ({ row }) => (
      <Tooltips tooltipPlacement="top" tooltipText={row.description}>
        <span>
          <InfoIcon color="primary" />
        </span>
      </Tooltips>
    ),
  },
];

export default function Help() {
  const { t } = useTranslation();
  const { selectedUseCases } = useAppSelector(state => state.appSlice);
  const { isSuccess, data } = useGetHelpPageDataQuery({ usecases: selectedUseCases });

  if (isSuccess) {
    return (
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h3" mb={1}>
          {t('pages.help')}
        </Typography>
        <Typography variant="body1" mb={4}>
          {t('content.help.description')}
        </Typography>
        {data.map((table: HelpPageData) => (
          <Grid key={table.id} container spacing={4} display={'flex'} alignItems={'center'}>
            <Grid item xs={8} mb={4}>
              <Table
                title={table.name}
                getRowId={row => row.id}
                autoHeight
                hideFooter={true}
                columns={columns}
                rows={table.rows}
                sx={{
                  '& .MuiDataGrid-cellCheckbox': {
                    padding: '0 30px',
                  },
                  '& h5.MuiTypography-root.MuiTypography-h5 span': {
                    display: 'none',
                  },
                }}
              />
            </Grid>
            <Grid item xs={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
              <Typography variant="body1" mb={4}>
                {table.description}
              </Typography>
              <DownloadCSV submodel={table.id} />
            </Grid>
          </Grid>
        ))}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5">{t('content.common.rules')}</Typography>
            <ul>
              <li> {t('content.help.rules1')}</li>
              <li> {t('content.help.rules2')}</li>
              <li> {t('content.help.rules3')}</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    );
  } else return null;
}
