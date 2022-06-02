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
import { commonColumns } from './CommonColumns';

function getObject(
  field: string,
  headerName: string,
  editable: boolean,
  sortable: boolean,
  flex: number,
  headerAlign: string,
  type?: string,
  valueOptions?: { value: string; label: string }[],
) {
  return { field, headerName, editable, sortable, flex, type, headerAlign, valueOptions };
}

export function getAssemblyPartRelationshipColumns() {
  const assemblyPartRelationshipColumns: DynamicTableColumn[] = commonColumns;
  const auxArray = JSON.parse(JSON.stringify(assemblyPartRelationshipColumns));

  auxArray.push(
    getObject('parent_uuid', 'Parent UUID', true, false, 1, 'center'),
    getObject('parent_part_instance_id', 'Parent Part Instance ID*', true, false, 1, 'center'),
    getObject('parent_manufacturer_part_id', 'Parent Manufacturer Part ID*', true, false, 1, 'center'),
    getObject(
      'parent_optional_identifier_key',
      'Parent Optional Identifier Key',
      true,
      false,
      1,
      'center',
      'singleSelect',
      [
        { value: '', label: 'Empty' },
        { value: 'VAN', label: 'VAN' },
        { value: 'BatchID', label: 'BatchID' },
      ],
    ),
    getObject('parent_optional_identifier_value', 'Parent Optional Identifier Value', true, false, 1, 'center'),
    getObject('lifecycle_context', 'Lifecycle Context*', true, false, 1, 'center'),
    getObject('quantity_number', 'Quantity Number*', true, false, 1, 'center'),
    getObject('measurement_unit_lexical_value', 'Measurement Unit Lexical Value*', true, false, 1, 'center'),
    getObject('datatype_uri', 'Datatype URI*', true, false, 1, 'center'),
    getObject('assembled_on', 'Assembled On*', true, false, 1, 'center'),
  );

  return auxArray;
}
