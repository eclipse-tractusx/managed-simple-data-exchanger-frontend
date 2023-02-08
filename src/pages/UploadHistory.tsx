/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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
import { Box, Grid } from '@mui/material';
import { LoadingButton, Typography } from 'cx-portal-shared-components';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Permissions from '../components/Permissions';
import StickyHeadTable from '../components/StickyHeadTable';
import { ProcessReport } from '../models/ProcessReport';
import ProviderService from '../services/ProviderService';

export default function UploadHistory() {
  const [tableData, setTableData] = useState<ProcessReport[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setloading] = useState(false);
  const { t } = useTranslation();

  const refreshTable = useCallback(async () => {
    try {
      setloading(true);
      const response = await ProviderService.getInstance().getUploadHistory({ page: page, pageSize: rowsPerPage });
      setTableData(response.data.items);
      setTotalElements(response.data.totalItems);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    let isApiSubscribed = true;
    if (isApiSubscribed) {
      refreshTable();
    }
    return () => {
      isApiSubscribed = false;
    };
  }, [page, rowsPerPage, refreshTable]);

  return (
    <Permissions values={['provider_view_history']} fullPage={true}>
      <Box sx={{ flex: 1, p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4">{t('pages.uploadHistory')}</Typography>
          </Grid>
          <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton
              size="small"
              variant="contained"
              label={t('button.refresh')}
              onButtonClick={() => refreshTable()}
              startIcon={<Refresh />}
              loadIndicator={t('content.common.loading')}
              loading={loading}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <StickyHeadTable
            rows={tableData}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            refreshTable={refreshTable}
          />
        </Box>
      </Box>
    </Permissions>
  );
}
