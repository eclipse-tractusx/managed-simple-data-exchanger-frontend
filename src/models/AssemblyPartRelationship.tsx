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

export interface AssemblyPartRelationship {
  id?: number;
  parent_uuid: string;
  parent_part_instance_id: string;
  parent_manufacturer_part_id: string;
  parent_optional_identifier_key: string;
  parent_optional_identifier_value: string;
  uuid: string;
  part_instance_id: string;
  manufacturer_part_id: string;
  optional_identifier_key: string;
  optional_identifier_value: string;
  lifecycle_context: string;
  quantity_number: string;
  measurement_unit_lexical_value: string;
  datatype_uri: string;
  assembled_on: string;
}
