import { Box, Button, Grid, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import OfferDetailsDialog from '../components/OfferDetailsDialog';
import { handleBlankCellValues } from '../helpers/ConsumerOfferHelper';
import DftService from '../services/DftService';
import { setContractOffers, setSelectedOffer, setOffersLoading } from '../store/consumerSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import { toast } from 'react-toastify';
import { toastProps } from '../helpers/ToastOptions';

export const ConsumeData: React.FC = () => {
  const [providerUrl, setProviderUrl] = useState('');
  const { contractOffers, offersLoading, selectedOffer } = useAppSelector(state => state.consumerSlice);
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const dispatch = useAppDispatch();

  const columns = [
    {
      field: 'title',
      width: 300,
      headerName: 'Title',
      renderHeader: () => <strong>Title</strong>,
    },
    {
      field: 'created',
      width: 130,
      editable: false,
      headerName: 'Created on',
      renderHeader: () => <strong>Created on</strong>,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.created),
    },
    {
      field: 'publisher',
      width: 130,
      editable: false,
      headerName: 'Publisher',
      renderHeader: () => <strong>Publisher</strong>,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.publisher.split(':')[0]),
    },
    {
      field: 'typeOfAccess',
      width: 150,
      editable: false,
      headerName: 'Access type',
      renderHeader: () => <strong>Access type</strong>,
    },
    {
      field: 'bpnNumbers',
      width: 300,
      editable: false,
      headerName: 'BPN',
      renderHeader: () => <strong>BPN</strong>,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.bpnNumbers.length > 0
          ? params.row.bpnNumbers.filter((bpn: string) => bpn !== 'null' || bpn !== null)
          : '-',
    },
    {
      field: 'description',
      width: 250,
      editable: false,
      headerName: 'Description',
      renderHeader: () => <strong>Description</strong>,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.description),
    },
  ];

  const toggleDialog = (flag: boolean) => {
    setIsOpenOfferDialog(flag);
    if (flag === false) {
      dispatch(setSelectedOffer(null));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowClick = (params: any) => {
    dispatch(setSelectedOffer(params.row));
    toggleDialog(true);
  };

  const fetchConsumerDataOffers = async () => {
    dispatch(setOffersLoading(true));
    try {
      const response = await DftService.getInstance().fetchConsumerDataOffers(providerUrl);
      dispatch(setContractOffers(response.data));
      dispatch(setOffersLoading(false));
    } catch (error) {
      dispatch(setContractOffers([]));
      dispatch(setOffersLoading(false));
      toast.error('Failed to retrieve data offers!', toastProps());
    }
  };

  // enter key fetch data
  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.code == 'Enter') {
      fetchConsumerDataOffers();
    }
  };

  useEffect(() => {
    dispatch(setContractOffers([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 py-6 px-10">
      <Grid container spacing={2}>
        <Grid item xs={12} my={4}>
          <Typography variant="h4">Consumer View</Typography>
        </Grid>
        <Grid item xs={12} mb={4}>
          <Stack direction="row" spacing={2}>
            <Typography ml={1} variant="subtitle1" gutterBottom>
              Enter data provider connector URL
            </Typography>
            <Box
              sx={{
                width: 600,
                maxWidth: '100%',
              }}
            >
              <TextField
                value={providerUrl}
                type="url"
                onChange={e => setProviderUrl(e.target.value)}
                onKeyPress={handleKeypress}
                fullWidth
                size="small"
                label="Provider URL"
              />
            </Box>
            <Button variant="contained" onClick={fetchConsumerDataOffers}>
              Query
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
            <DataGrid
              sx={{ py: 1 }}
              autoHeight={true}
              getRowId={row => row.connectorOfferid}
              rows={contractOffers}
              onRowClick={onRowClick}
              columns={columns}
              loading={offersLoading}
              checkboxSelection
              pagination
              pageSize={pageSize}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 25, 50, 100]}
              components={{
                Toolbar: GridToolbar,
                LoadingOverlay: LinearProgress,
                NoRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    No Data offers!
                  </Stack>
                ),
                NoResultsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    Data offer not found!
                  </Stack>
                ),
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
      {selectedOffer && (
        <OfferDetailsDialog open={isOpenOfferDialog} offerObj={selectedOffer} handleClose={toggleDialog} />
      )}
    </div>
  );
};
