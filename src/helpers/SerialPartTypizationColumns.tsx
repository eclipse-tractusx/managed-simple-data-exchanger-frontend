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

export function getSerialPartTypizationColumns() {
  const serialPartTypizationColumns: DynamicTableColumn[] = commonColumns;
  const auxArray = JSON.parse(JSON.stringify(serialPartTypizationColumns));

  auxArray.push(
    getObject('manufacturing_date', 'Manufacturing Date*', true, false, 1, 'center', 'date'),
    getObject(
      'manufacturing_country',
      'Manufacturing Country',
      true,
      false,
      1,
      'center',
      'singleSelect',
      Countries.list,
    ),
    getObject('manufacturer_part_id', 'Manufacturer Part ID*', true, false, 1, 'center'),
    getObject('customer_part_id', 'Customer Part ID', true, false, 1, 'center'),
    getObject('classification', 'Classification', true, false, 1, 'center'),
    getObject('name_at_manufacturer', 'Name at Manufacturer*', true, false, 1, 'center'),
    getObject('name_at_customer', 'Name at customer', true, false, 1, 'center'),
  );

  return auxArray;
}
