import { Box, Button } from '@mui/material';
import { DataGrid, GridCellEditCommitParams, GridRowId } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { fetchSubmodelDetails } from '../features/submodels/actions';
import { addRows, deleteRows, setRows, setSelectionModel, validateTableData } from '../features/submodels/slice';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function DataTable() {
  const { selectedSubmodel, columns, rows, selectionModel } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchSubmodelDetails(selectedSubmodel));
  }, []);
  //TODO
  //1. Required fields
  //2. check validation
  //3. add proper formats(date fields)
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Button onClick={() => dispatch(addRows())}>Add row</Button>
      <Button onClick={() => dispatch(deleteRows())}>Delete row</Button>
      <Button onClick={() => dispatch(validateTableData())}>Validate</Button>
      <DataGrid
        getRowId={row => row.id}
        autoHeight={false}
        rows={rows}
        columns={columns}
        hideFooter={true}
        disableColumnMenu={true}
        disableSelectionOnClick={true}
        checkboxSelection
        selectionModel={selectionModel}
        onSelectionModelChange={(ids: GridRowId[]) => {
          dispatch(setSelectionModel(ids));
        }}
        onCellEditCommit={(params: GridCellEditCommitParams) => {
          dispatch(setRows(params));
        }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: 'clip',
            whiteSpace: 'break-spaces',
            lineHeight: 1.5,
            textAlign: 'center',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '0 10px',
          },
          '& .MuiDataGrid-columnHeaderCheckbox': {
            height: 'auto !important',
          },
        }}
      />
    </Box>
  );
}
