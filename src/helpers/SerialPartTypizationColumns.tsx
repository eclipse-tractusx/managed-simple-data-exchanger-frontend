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
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { DynamicTableColumn } from '../models/DynamicTableColumn';
import * as Countries from '../helpers/Countries';
import { commonColumns } from './CommonColumns';

export function getSerialPartTypizationColumns() {
  const serialPartTypizationColumns: DynamicTableColumn[] = commonColumns;
  const auxArray = JSON.parse(JSON.stringify(serialPartTypizationColumns));

  auxArray.push(
    {
      field: 'manufacturing_date',
      headerName: 'Manufacturing Date*',
      editable: true,
      sortable: false,
      flex: 1,
      type: 'date',
      headerAlign: 'center',
    },
    {
      field: 'manufacturing_country',
      headerName: 'Manufacturing Country',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      type: 'singleSelect',
      valueOptions: Countries.list,
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
      field: 'name_at_customer',
      headerName: 'Name at customer',
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
    },
  );

  return auxArray;
}
