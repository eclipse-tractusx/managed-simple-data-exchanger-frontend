import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Table, Tooltips } from 'cx-portal-shared-components';
import { useState } from 'react';

import { useGetHistoryQuery } from '../features/provider/history/apiSlice';
import { formatDate } from '../utils/utils';

function UploadHistoryNew() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, isSuccess } = useGetHistoryQuery({ page: page, pageSize: pageSize });

  const columns: GridColDef[] = [
    {
      field: 'processId',
      headerName: 'Process Id',
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={row.processId}>
          <span>{row.processId}</span>
        </Tooltips>
      ),
    },
    { field: 'csvType', headerName: 'CSV Type', minWidth: 100, flex: 1 },
    {
      field: 'numberOfSucceededItems',
      headerName: 'Number of Created Items',
      align: 'center',
      flex: 1,
    },
    {
      field: 'numberOfUpdatedItems',
      headerName: 'Number of Updated Items',
      align: 'center',
      flex: 1,
    },
    {
      field: 'numberOfDeletedItems',
      headerName: 'Number of Deleted Items',
      align: 'center',
      flex: 1,
    },
    {
      field: 'numberOfFailedItems',
      headerName: 'Number of Failed Items',
      align: 'center',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      valueGetter: (params: GridValueGetterParams) => formatDate(params.row.startDate),
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
    },
  ];

  if (isSuccess) {
    return (
      <Table
        title={'New Upload History'}
        getRowId={row => row.processId}
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        disableSelectionOnClick
        columns={columns}
        rows={data.items}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: 'clip',
            whiteSpace: 'break-spaces',
            lineHeight: 1.5,
            textAlign: 'center',
          },
          '& h5.MuiTypography-root.MuiTypography-h5 span': {
            display: 'none',
          },
        }}
      />
    );
  } else return null;
}

export default UploadHistoryNew;
