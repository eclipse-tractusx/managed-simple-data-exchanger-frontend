/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
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
import { GridSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { includes, indexOf } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { fetchSubmodelDetails, fetchSubmodelList } from './actions';
import { ISubmodelList, ISubmodelsSlice } from './types';

const initialState: ISubmodelsSlice = {
  selectedSubmodel: {} as ISubmodelList,
  submodelList: [],
  submodelDetails: {},
  columns: [],
  rows: [],
  row: {},
  selectionModel: [],
  selectedRows: [],
  jsonInputData: '',
  previewTableHeadings: [],
  previewTableData: [],
  previewTableDescriptions: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleColumnTypes = (value: any) => {
  if (value.type.includes('number')) {
    return value.enum?.length ? 'singleSelect' : 'number';
  } else if (value.type.includes('string')) {
    return value.enum?.length ? 'singleSelect' : 'string';
  } else {
    return 'string';
  }
};

export const submodelSlice = createSlice({
  name: 'submodelSlice',
  initialState,
  reducers: {
    setSelectedSubmodel: (state, action: PayloadAction<ISubmodelList>) => {
      state.selectedSubmodel = action.payload;
    },
    addRows: state => {
      const genUUID = () => (includes(Object.keys(state.row), 'uuid') ? { uuid: `urn:uuid:${uuidv4()}` } : {});
      state.rows = state.rows.concat({ rowId: state.rows.length, ...state.row, ...genUUID() });
    },
    deleteRows: state => {
      const selectedIDs = new Set(state.selectionModel);
      state.rows = state.rows.filter(x => !selectedIDs.has(x.rowId));
    },
    setRows: (state, action: PayloadAction<GridValidRowModel>) => {
      const { id, field, value, isEditable } = action.payload;
      if (value === '' && isEditable) {
        state.rows[id][field] = null;
      } else {
        state.rows[id][field] = value;
      }
    },
    setSelectionModel: (state, action: PayloadAction<GridSelectionModel>) => {
      state.selectionModel = action.payload;
      const selectedIDs = new Set(state.selectionModel);
      state.selectedRows = state.rows.filter(row => selectedIDs.has(row.rowId));
    },
    setJsonInputData: (state, action: PayloadAction<string>) => {
      state.jsonInputData = action.payload;
    },
    clearRows: state => {
      state.rows = [];
      state.jsonInputData = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSubmodelList.fulfilled, (state, { payload }) => {
      const list = payload.map((e: { id: string; name: string }, index: number) => {
        const item = { id: index, title: e.name, value: e.id };
        return item;
      });
      state.submodelList = list;
    });
    builder.addCase(fetchSubmodelDetails.pending, state => {
      state.row = {};
      state.rows = [];
    });
    builder.addCase(fetchSubmodelDetails.fulfilled, (state, { payload }) => {
      state.submodelDetails = payload;
      state.columns = Object.entries(payload.items.properties).map(([key, value]: any) => ({
        field: key,
        headerName: `${value.title}${indexOf(payload.items.required, key) > -1 ? '*' : ''}`,
        editable: true,
        sortable: false,
        flex: 1,
        headerAlign: 'left',
        type: handleColumnTypes(value),
        valueOptions: value.enum,
      }));
      Object.entries(payload.items.properties).forEach(([key, value]: any) => {
        if (value.enum?.length) {
          state.row[key] = '';
        } else {
          state.row[key] = null;
        }
      });
      // for submodel description table
      state.previewTableHeadings = ['Field name', ...Object.keys(payload.items.properties)];
      state.previewTableDescriptions = Object.entries(payload.items.properties).map(
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        ([key, value]: any) => value.description,
      );
      state.previewTableData = [
        [
          'Example entries',
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          ...Object.entries(payload.items.properties).map(([key, value]: any) => value.examples[0]),
        ],
        [
          'Mandatory',
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          ...Object.entries(payload.items.properties).map(([key, value]: any) =>
            indexOf(payload.items.required, key) > -1 ? 'true' : 'false',
          ),
        ],
      ];
    });
  },
});
export const { setSelectedSubmodel, addRows, setRows, setSelectionModel, deleteRows, clearRows, setJsonInputData } =
  submodelSlice.actions;
export default submodelSlice.reducer;
