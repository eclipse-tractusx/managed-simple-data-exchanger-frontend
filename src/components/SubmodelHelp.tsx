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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Card, CardActions, CardContent, useTheme } from '@mui/material';
import { Button, Table } from 'cx-portal-shared-components';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setSnackbarMessage } from '../features/notifiication/slice';
import { ISubmodelHelpProps } from '../models/Help';

export const SubmodelHelp: React.FC<ISubmodelHelpProps> = ({
  submodelName = '',
  rows,
  onCopyHeaders,
  downloadUrl = '',
}) => {
  const columns = [
    {
      field: 'name',
      flex: 4,
      headerName: 'Name',
      sortable: false,
    },
    {
      field: 'mandatory',
      flex: 2,
      headerName: 'Mandatory',
      sortable: false,
    },
    {
      field: 'position',
      flex: 2,
      headerName: 'Position',
      sortable: false,
    },
  ];
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Table
            rows={rows}
            columns={columns}
            getRowId={row => row.position}
            autoHeight
            columnHeadersBackgroundColor={theme.palette.primary.main}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            headerHeight={40}
            hideFooter
            title={submodelName}
            rowHeight={40}
            sx={{
              '& h5.MuiTypography-root.MuiTypography-h5 span': {
                display: 'none',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: 'white',
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': { background: theme.palette.grey[100] },
            }}
          />
        </CardContent>
        <CardActions>
          <Button size="small" variant="text" startIcon={<GetAppIcon />}>
            <Link to={downloadUrl} target="_blank" download>
              Download sample
            </Link>
          </Button>
          <Button
            onClick={() => {
              onCopyHeaders();
              dispatch(
                setSnackbarMessage({
                  message: 'Copied to clipboard!',
                  type: 'success',
                }),
              );
            }}
            size="small"
            variant="text"
            startIcon={<ContentCopyIcon />}
          >
            Copy headers to clipboard
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
