import { GridSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSubmodelList, fetchSubmodelDetails } from './actions';
import { ISubmodelsSlice } from './types';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const initialState: ISubmodelsSlice = {
  selectedSubmodel: 'Aspect',
  submodelList: [],
  submodelDetails: {},
  columns: [],
  rows: [],
  row: {},
  selectionModel: [],
  selectedRows: [],
};
let idCounter = -1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleColumnTypes = (value: any) => {
  if (value.format === 'date-time') {
    return 'dateTime';
  } else if (value.enum?.length) {
    return 'singleSelect';
  } else {
    return 'string';
  }
};

//TODO
//1. Required fields - done
//2. check validation - partially done, chain errors pending
//3. add proper formats(date fields) - pending (remove zone)

export const submodelSlice = createSlice({
  name: 'submodelSlice',
  initialState,
  reducers: {
    setSelectedSubmodel: (state, action: PayloadAction<string>) => {
      state.selectedSubmodel = action.payload;
    },
    addRows: state => {
      state.rows = state.rows.concat({ id: (idCounter += 1), ...state.row, uuid: `urn:uuid:${uuidv4()}` });
    },
    deleteRows: state => {
      const selectedIDs = new Set(state.selectionModel);
      state.rows = state.rows.filter(x => !selectedIDs.has(x.id));
    },
    setRows: (state, action: PayloadAction<GridValidRowModel>) => {
      console.log(action.payload);
      const { id, field, value } = action.payload;
      state.rows[id][field] = value;
    },
    setSelectionModel: (state, action: PayloadAction<GridSelectionModel>) => {
      state.selectionModel = action.payload;
      const selectedIDs = new Set(state.selectionModel);
      state.selectedRows = state.rows.filter(row => selectedIDs.has(row.id));
    },
    validateTableData: state => {
      const selectedIDs = new Set(state.selectionModel);
      state.selectedRows = state.rows.filter(row => selectedIDs.has(row.id));
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.columns = Object.entries(payload.items.properties).map(([key, value]: any) => ({
        field: key,
        headerName: `${value.title}${_.indexOf(state.submodelDetails.items.required, key) > -1 ? '*' : ''}`,
        editable: true,
        sortable: false,
        flex: 1,
        headerAlign: 'left',
        type: handleColumnTypes(value),
        valueOptions: value.enum,
      }));
      Object.keys(payload.items.properties).forEach(e => {
        state.row[e] = '';
      });
    });
  },
});
export const { setSelectedSubmodel, addRows, setRows, setSelectionModel, deleteRows, validateTableData } =
  submodelSlice.actions;
export default submodelSlice.reducer;
