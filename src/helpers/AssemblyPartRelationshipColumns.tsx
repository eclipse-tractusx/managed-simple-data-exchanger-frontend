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
  headerAlign: string,
  type?: string,
  valueOptions?: { value: string; label: string }[],
) {
  return { field, headerName, editable: true, sortable: false, flex: 1, type, headerAlign, valueOptions };
}

export function getAssemblyPartRelationshipColumns() {
  const assemblyPartRelationshipColumns: DynamicTableColumn[] = commonColumns;
  const auxArray = JSON.parse(JSON.stringify(assemblyPartRelationshipColumns));

  auxArray.push(
    getObject('parent_uuid', 'Parent UUID', 'center'),
    getObject('parent_part_instance_id', 'Parent Part Instance ID*', 'center'),
    getObject('parent_manufacturer_part_id', 'Parent Manufacturer Part ID*', 'center'),
    getObject('parent_optional_identifier_key', 'Parent Optional Identifier Key', 'center', 'singleSelect', [
      { value: '', label: 'Empty' },
      { value: 'VAN', label: 'VAN' },
      { value: 'BatchID', label: 'BatchID' },
    ]),
    getObject('parent_optional_identifier_value', 'Parent Optional Identifier Value', 'center'),
    getObject('lifecycle_context', 'Lifecycle Context*', 'center'),
    getObject('quantity_number', 'Quantity Number*', 'center'),
    getObject('measurement_unit_lexical_value', 'Measurement Unit Lexical Value*', 'center'),
    getObject('manufacturer_part_id', 'Manufacturer Part ID*', 'center'),
    getObject('datatype_uri', 'Datatype URI*', 'center'),
    getObject('assembled_on', 'Assembled On*', 'center'),
  );

  return auxArray;
}
