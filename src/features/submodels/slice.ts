import { GridSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import schemaValidator from '../../helpers/SchemaValidator';
import { fetchSubmodelList, fetchSubmodelDetails } from './actions';
import { ISubmodelsSlice } from './types';
import { v4 as uuidv4 } from 'uuid';

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

export const submodelSlice = createSlice({
  name: 'submodelSlice',
  initialState,
  reducers: {
    setSelectedSubmodel: (state, action: PayloadAction<string>) => {
      state.selectedSubmodel = action.payload;
    },
    addRows: state => {
      state.rows = state.rows.concat({ id: (idCounter += 1), ...state.row, UUID: `urn:uuid:${uuidv4()}` });
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
      const selectedIDs = new Set(action.payload);
      state.selectedRows = state.rows.filter(row => selectedIDs.has(row.id));
    },
    validateTableData: state => {
      schemaValidator(state.submodelDetails, state.selectedRows);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSubmodelList.fulfilled, (state, { payload }) => {
      state.submodelList = payload;
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
        headerName: value.title,
        editable: key === 'UUID' ? false : true,
        sortable: false,
        flex: 1,
        headerAlign: 'center',
        type: value.format === 'date-time' ? 'date' : 'string',
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
