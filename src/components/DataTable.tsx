import { Box } from '@mui/material';
import { GridCellEditCommitParams, GridRowId } from '@mui/x-data-grid';
import { Button, Table } from 'cx-portal-shared-components';
import { addRows, deleteRows, setRows, setSelectionModel } from '../features/submodels/slice';
import { schemaValidator } from '../helpers/SchemaValidator';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function DataTable() {
  const { submodelDetails, columns, rows, selectionModel, selectedRows } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const handleSubmitData = () => {
    const selectedIDs = new Set(selectionModel);
    const tableData = rows.filter(row => selectedIDs.has(row.id));
    schemaValidator(tableData);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Button variant="contained" size="small" onClick={() => dispatch(addRows())}>
            Add row
          </Button>
        </Box>
        <Box>
          <Button variant="contained" size="small" onClick={() => dispatch(deleteRows())} sx={{ mr: 2 }}>
            Delete row(s)
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={!Boolean(selectedRows.length)}
            onClick={() => {
              handleSubmitData();
            }}
          >
            Next Step - Configure Policies
          </Button>
        </Box>
      </Box>
      <Table
        title={submodelDetails.title}
        getRowId={row => row.id}
        autoHeight
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
          '& h5.MuiTypography-root.MuiTypography-h5 span': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
}
