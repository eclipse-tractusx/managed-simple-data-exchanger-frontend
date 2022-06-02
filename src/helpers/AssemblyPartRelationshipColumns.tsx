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

export const assemblyPartRelationshipColumns: DynamicTableColumn[] = [
  {
    field: 'parent_uuid',
    headerName: 'Parent UUID',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'parent_part_instance_id',
    headerName: 'Parent Part Instance ID*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'parent_manufacturer_part_id',
    headerName: 'Parent Manufacturer Part ID*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'parent_optional_identifier_key',
    headerName: 'Parent Optional Identifier Key',
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
    field: 'parent_optional_identifier_value',
    headerName: 'Parent Optional Identifier Value',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
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
  {
    field: 'lifecycle_context',
    headerName: 'Lifecycle Context*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'quantity_number',
    headerName: 'Quantity Number*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'measurement_unit_lexical_value',
    headerName: 'Measurement Unit Lexical Value*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'datatype_uri',
    headerName: 'Datatype URI*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
  {
    field: 'assembled_on',
    headerName: 'Assembled On*',
    editable: true,
    sortable: false,
    flex: 1,
    headerAlign: 'center',
  },
];
