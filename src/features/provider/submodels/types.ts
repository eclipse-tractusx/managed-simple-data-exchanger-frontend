/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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

import { GridColDef, GridSelectionModel, GridValidRowModel } from '@mui/x-data-grid';

export interface ISubmodelList {
  id: number;
  title: string;
  value: string;
}
export interface ISubmodelsSlice {
  selectedSubmodel: ISubmodelList;
  submodelList: ISubmodelList[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submodelDetails: any;
  columns: GridColDef[];
  rows: GridValidRowModel[];
  row: GridValidRowModel;
  selectionModel: GridSelectionModel;
  selectedRows: GridValidRowModel[];
  jsonInputData: string;
}

export interface HelpPageData {
  name: string;
  description: string;
  id: string;
  rows: {
    name: string;
    mandatory: string;
    order: number;
    description: string;
  }[];
}
