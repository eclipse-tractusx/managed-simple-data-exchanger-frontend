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

export interface Batch {
  id?: number;
  uuid: string;
  batch_id: string;
  manufacturing_date: string;
  manufacturing_country: string;
  manufacturer_part_id: string;
  customer_part_id: string;
  classification: string;
  name_at_manufacturer: string;
  name_at_customer: string;
  optional_identifier_key: string;
  optional_identifier_value: string;
}
