// Copyright 2022 Catena-X
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF \ KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { SerialPartTypization } from '../models/SerialPartTypization';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses, GridSelectionModel } from '@mui/x-data-grid';
import { DynamicTableColumn } from '../models/DynamicTableColumn';
import { v4 as uuidv4 } from 'uuid';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { IconButton, Button } from '@mui/material';

export default function DynamicTable() {
  const [rows, setRows] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [id, setId] = React.useState(0);

  const addRow = () => {
    setId(id + 1);
    setRows(prevRows => [
      ...prevRows,
      {
        id: id,
        uuid: '',
        part_instance_id: '',
        manufacturing_date: '',
        manufacturing_country: '',
        manufacturer_part_id: '',
        customer_part_id: '',
        classification: '',
        name_at_manufacturer: '',
        name_at_customer: '',
        optional_identifier_key: '',
        optional_identifier_value: '',
      },
    ]);
  };

  const generateUUID = (rowId: number) => {
    const auxRows = Object.assign([], rows);

    for (const r of auxRows) {
      if (r.id === rowId) {
        r.uuid = uuidv4();
      }
    }

    setRows(auxRows);
  };

  const onSelectionChange = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel);
  };

  const deleteSelectedRows = () => {
    const auxRows = Object.assign([], rows);

    if (selectionModel.length > 0) {
      for (const s of selectionModel) {
        const index = auxRows.findIndex(a => a.id === s);
        if (index !== -1) {
          auxRows.splice(index, 1);
        }
      }
    }

    setRows(auxRows);
  };

  // styles
  const ODD_OPACITY = 0.2;

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.grey[200],
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
          ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
          },
        },
      },
    },
  }));

  // end styles

  const columns: DynamicTableColumn[] = [
    {
      field: 'uuid',
      headerName: 'UUID',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      renderCell: (params: { id: number; value: string }) => {
        return (
          <div>
            {params.value === '' && (
              <IconButton onClick={() => generateUUID(params.id)} title="Generate UUID">
                <AutoFixHighIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {params.value !== '' && params.value}
          </div>
        );
      },
    },
    {
      field: 'part_instance_id',
      headerName: 'Part Instance ID*',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'manufacturing_date',
      headerName: 'Manufacturing Date*',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'manufacturing_country',
      headerName: 'Manufacturing Country',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'manufacturer_part_id',
      headerName: 'Manufacturer Part ID*',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'customer_part_id',
      headerName: 'Customer Part ID',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'classification',
      headerName: 'Classification*',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'name_at_manufacturer',
      headerName: 'Name at Manufacturer*',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'optional_identifier_key',
      headerName: 'Optional Identifier Key',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'optional_identifier_value',
      headerName: 'Optional Identifier Value',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
  ];

  const onCellEditCommit = (event: any) => {
    const auxRows = JSON.parse(JSON.stringify(rows));
    const index = rows.findIndex(r => r.id === event.id);
    if (index !== -1) {
      if (auxRows[index].hasOwnProperty(event.field)) {
        const f = event.field as keyof SerialPartTypization;
        auxRows[index][f] = event.value;
      }
    }

    setRows(auxRows);
  };

  const generateJson = () => {
    if (rows && rows.length > 0) {
      for (const r of rows) {
        if (
          r.part_instance_id === '' ||
          r.manufacturing_date === '' ||
          r.manufacturer_part_id === '' ||
          r.classification === '' ||
          r.name_at_manufacturer === ''
        ) {
          return alert(
            'Invalid data! Part Instance ID, Manufacturing Date, Manufacturer Part ID, Classification and Name of Manufacturer fields are required.',
          );
        }
      }
    } else {
      return alert(
        'Invalid data! Part Instance ID, Manufacturing Date, Manufacturer Part ID, Classification and Name of Manufacturer fields are required.',
      );
    }
  };

  return (
    <div style={{ width: '100%', height: 108 + 6 * 52 + 'px' }}>
      <Button variant="outlined" onClick={addRow} sx={{ mb: 2 }}>
        Add a row
      </Button>
      &nbsp;
      <Button variant="outlined" onClick={deleteSelectedRows} sx={{ mb: 2 }}>
        Delete row(s)
      </Button>
      <StripedDataGrid
        getRowId={row => row.id}
        autoHeight={false}
        columns={columns}
        rows={rows}
        disableColumnMenu={true}
        hideFooter={true}
        checkboxSelection={true}
        disableSelectionOnClick={true}
        onSelectionModelChange={onSelectionChange}
        selectionModel={selectionModel}
        onCellEditCommit={onCellEditCommit}
        getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: 'clip',
            whiteSpace: 'break-spaces',
            lineHeight: 1.5,
            textAlign: 'center',
          },
        }}
      />
      <div> * Mandatory </div>
      <Button variant="outlined" onClick={generateJson} sx={{ mt: 2 }}>
        Generate JSON
      </Button>
    </div>
  );
}
