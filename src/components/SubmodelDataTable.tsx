/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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
import { Button } from '@catena-x/portal-shared-components';
import { Box } from '@mui/material';
import { DataGrid, GridCellEditCommitParams, GridRowId } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { addRows, deleteRows, setRows, setSelectionModel } from '../features/provider/submodels/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { schemaValidator } from '../helpers/SchemaValidator';
import InfoSteps from './InfoSteps';
import UploadInfo from './provider/UploadInfo';

export default function DataTable() {
  const { columns, rows, selectionModel, selectedRows } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Box>
      <UploadInfo />
      <Box display="flex" justifyContent="space-between" my={3}>
        <Box>
          <Button variant="contained" size="small" onClick={() => dispatch(addRows())}>
            {t('content.provider.addRow')}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => dispatch(deleteRows())}
            sx={{ ml: 2 }}
            disabled={!selectedRows.length}
          >
            {t('content.provider.deleteRow')}
          </Button>
        </Box>
        <Box>
          <Button variant="contained" size="small" disabled={!rows.length} onClick={() => schemaValidator(rows)}>
            {t('content.policies.configure')}
          </Button>
        </Box>
      </Box>
      <DataGrid
        getRowId={row => row.rowId}
        autoHeight
        rows={rows}
        columns={columns}
        hideFooter={true}
        disableColumnMenu={true}
        disableSelectionOnClick={true}
        checkboxSelection
        selectionModel={selectionModel}
        onSelectionModelChange={(ids: GridRowId[]) => {
          dispatch(setSelectionModel(ids));
        }}
        onCellEditCommit={(params: GridCellEditCommitParams) => {
          dispatch(setRows(params));
        }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: 'clip',
            whiteSpace: 'break-spaces',
            lineHeight: 1.5,
            textAlign: 'center',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '0 10px',
          },
          '& .MuiDataGrid-cell': {
            padding: '0 10px',
          },
          '& .MuiDataGrid-columnHeaderCheckbox': {
            height: 'auto !important',
          },
          '& .MuiDataGrid-cellCheckbox': {
            padding: '0 30px',
          },
          '& h5.MuiTypography-root.MuiTypography-h5 span': {
            display: 'none',
          },
        }}
      />
      <InfoSteps
        icon="tips"
        steps={['content.provider.manualInfo_1', 'content.provider.manualInfo_2']}
        sx={{ mt: 3 }}
      />
    </Box>
  );
}
