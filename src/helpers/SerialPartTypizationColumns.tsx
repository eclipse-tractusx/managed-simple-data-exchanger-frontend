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

export const serialPartTypizationColumns: DynamicTableColumn[] = [
  {
    field: 'uuid',
    headerName: 'UUID',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
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
  {
    field: 'optional_identifier_key',
    headerName: 'Optional Identifier Key',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
    type: 'singleSelect',
    valueOptions: [
      { value: '', label: 'Empty' },
      { value: 'VAN', label: 'VAN' },
      { value: 'BatchID', label: 'BatchID' },
    ],
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
