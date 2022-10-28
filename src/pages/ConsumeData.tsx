/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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
const ITEMS = [
  {
    id: 1,
    title: 'Company Name',
    value: 'company',
  },
  {
    id: 2,
    title: 'Business Partner Number',
    value: 'bpn',
  },
  {
    id: 3,
    title: 'Connector URL',
    value: 'url',
  },
];
import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { SelectList, Button, Input, Typography } from 'cx-portal-shared-components';
import { DataGrid, GridSelectionModel, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import OfferDetailsDialog from '../components/OfferDetailsDialog';
import ConfirmTermsDialog from '../components/ConfirmTermsDialog';
import { arraysEqual, handleBlankCellValues } from '../helpers/ConsumerOfferHelper';
import { ILegalEntityContent, IConnectorResponse } from '../models/ConsumerContractOffers';
import DftService from '../services/DftService';
import {
  setContractOffers,
  setSelectedOffer,
  setOffersLoading,
  setSelectedOffersList,
  setIsMultipleContractSubscription,
  setSearchFilterByType,
  setFilterProviderUrl,
  setFilterCompanyOptions,
  setFfilterCompanyOptionsLoading,
  setSelectedFilterCompanyOption,
  setFilterSelectedBPN,
  setFilterSelectedConnector,
  setFilterConnectors,
} from '../store/consumerSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import { toast } from 'react-toastify';
import { toastProps } from '../helpers/ToastOptions';
import { IntOption } from '../models/ConsumerContractOffers';
import Swal from 'sweetalert2';

export const ConsumeData: React.FC = () => {
  const {
    contractOffers,
    offersLoading,
    selectedOffer,
    selectedOffersList,
    isMultipleContractSubscription,
    searchFilterByType,
    filterProviderUrl,
    filterCompanyOptions,
    filterCompanyOptionsLoading,
    filterConnectors,
    filterSelectedConnector,
    filterSelectedBPN,
  } = useAppSelector(state => state.consumerSlice);
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState<boolean>(false);
  const [isOpenOfferConfirmDialog, setIsOpenOfferConfirmDialog] = useState<boolean>(false);
  const [isOfferSubLoading, setIsOfferSubLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const dispatch = useAppDispatch();

  const columns = [
    {
      field: 'title',
      flex: 1,
      headerName: 'Title',
      renderHeader: () => <strong>Title</strong>,
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: 'Asset ID',
      renderHeader: () => <strong>Asset ID</strong>,
    },
    {
      field: 'created',
      flex: 1,
      editable: false,
      headerName: 'Created on',
      renderHeader: () => <strong>Created on</strong>,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.created),
    },
    {
      field: 'publisher',
      flex: 1,
      editable: false,
      headerName: 'Publisher',
      renderHeader: () => <strong>Publisher</strong>,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.publisher.split(':')[0]),
    },
    {
      field: 'typeOfAccess',
      flex: 1,
      editable: false,
      headerName: 'Access type',
      renderHeader: () => <strong>Access type</strong>,
    },
    {
      field: 'bpnNumbers',
      flex: 1,
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
      flex: 1,
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

  /**
   * Handle offer details dialog action button event
   * @param type: 'close', 'subscribe': type of button
   */
  const handleDetailsButtonEvent = (type: string) => {
    if (type === 'close') {
      toggleDialog(false);
    } else if (type === 'subscribe') {
      // open policy dialog
      setIsOpenOfferConfirmDialog(true);
    }
  };

  /**
   * Toggle terms and condition confirm dialog
   * @param flag: 'close', 'confirm': type of button
   */
  const handleConfirmTermDialog = async (flag: string) => {
    if (flag === 'close') {
      setIsOpenOfferConfirmDialog(false);
    } else if (flag === 'confirm') {
      try {
        let payload;
        const offersList: unknown[] = [];
        // multiselect or single selecte
        if (isMultipleContractSubscription) {
          selectedOffersList.map(offer => {
            offersList.push({
              offerId: offer.offerId || '',
              assetId: offer.assetId || '',
              policyId: offer.policyId || '',
            });
          });
          payload = {
            connectorId: selectedOffersList[0].connectorId,
            providerUrl:
              searchFilterByType === 'company' || searchFilterByType === 'bpn'
                ? filterSelectedConnector
                : filterProviderUrl,
            offers: offersList,
            policies: selectedOffersList[0].usagePolicies,
          };
        } else {
          const { usagePolicies, offerId, assetId, policyId, connectorId } = selectedOffer;
          offersList.push({
            offerId: offerId || '',
            assetId: assetId || '',
            policyId: policyId || '',
          });
          payload = {
            connectorId: connectorId,
            providerUrl:
              searchFilterByType === 'company' || searchFilterByType === 'bpn'
                ? filterSelectedConnector
                : filterProviderUrl,
            offers: offersList,
            policies: usagePolicies,
          };
        }
        setIsOfferSubLoading(true);
        const response = await DftService.getInstance().subscribeToOffers(payload);
        setIsOfferSubLoading(false);
        if (response.status == 200) {
          toast.success('Contract offers subscription successfully initiated', toastProps());
          setIsOpenOfferDialog(false);
          setIsOpenOfferConfirmDialog(false);
          dispatch(setIsMultipleContractSubscription(false));
          dispatch(setSelectedOffer(null));
          dispatch(setSelectedOffersList([]));
          setSelectionModel([]);
        }
      } catch (error) {
        setIsOfferSubLoading(false);
        toast.error('Contract offers subscription failed!', toastProps());
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowClick = (params: any) => {
    dispatch(setSelectedOffer(params.row));
    toggleDialog(true);
  };

  const fetchConsumerDataOffers = async () => {
    try {
      let providerUrl = '';
      if (searchFilterByType === 'company' || searchFilterByType === 'bpn') {
        providerUrl = filterSelectedConnector;
      } else {
        providerUrl = filterProviderUrl;
      }
      if (providerUrl == '' || providerUrl == null) {
        return true;
      }
      dispatch(setOffersLoading(true));
      const response = await DftService.getInstance().fetchConsumerDataOffers(providerUrl);
      dispatch(setContractOffers(response.data));
      dispatch(setOffersLoading(false));
    } catch (error) {
      dispatch(setContractOffers([]));
      dispatch(setOffersLoading(false));
    }
  };

  // enter key fetch data
  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.code == 'Enter') {
      fetchConsumerDataOffers();
    }
  };

  const checkoutSelectedOffers = () => {
    let isUsagePoliciesEqual = false;
    const useCasesList: any[] = [];
    selectedOffersList.map(offer => {
      if (offer.usagePolicies.length > 0) {
        useCasesList.push(offer.usagePolicies);
      }
    });
    useCasesList.forEach(useCase => {
      if (arraysEqual(useCasesList[0], useCase)) isUsagePoliciesEqual = true;
      else isUsagePoliciesEqual = false;
    });
    if (isUsagePoliciesEqual) {
      setIsOpenOfferDialog(true);
      dispatch(setIsMultipleContractSubscription(true));
    } else {
      Swal.fire({
        title: 'Usage policies are not identical!',
        html: '<p> The contract offers within your search results do not have an identical usage policy. Subscribing to multiple offers is only available for contract offers that have an identical policy. </p>',
        icon: 'error',
        confirmButtonColor: '#01579b',
      });
      setIsOpenOfferDialog(false);
      dispatch(setIsMultipleContractSubscription(false));
    }
  };

  // get company name oninput change
  const onChangeSearchInputValue = async (params: string) => {
    const searchStr = params.toLowerCase();
    if (searchStr.length > 2) {
      dispatch(setFilterCompanyOptions([]));
      dispatch(setFfilterCompanyOptionsLoading(true));
      const res: [] = await DftService.getInstance().searchLegalEntities(searchStr);
      dispatch(setFfilterCompanyOptionsLoading(false));
      if (res.length > 0) {
        const filterContent = res.map((item: ILegalEntityContent, index) => {
          return {
            _id: index,
            bpn: item.bpn,
            value: item.name,
          };
        });
        dispatch(setFilterCompanyOptions(filterContent));
      }
    } else {
      dispatch(setFilterCompanyOptions([]));
    }
  };

  // on change search type filter option
  const handleSearchTypeChange = (value: string) => {
    dispatch(setSearchFilterByType(value));
    dispatch(setSelectedFilterCompanyOption(null));
    dispatch(setFilterProviderUrl(''));
    dispatch(setFilterSelectedBPN(''));
    dispatch(setFilterConnectors([]));
    dispatch(setFilterSelectedConnector(''));
  };

  // TODO:: get connector by bpn number
  const getConnectorByBPN = async (bpn: string) => {
    const payload = [];
    payload.push(bpn);
    dispatch(setFilterSelectedConnector(''));
    dispatch(setFilterConnectors([]));
    const res = await DftService.getInstance().searchConnectoByBPN(payload);
    if (res.length) {
      const resC: IConnectorResponse[] = res;
      const connector = resC[0];
      const optionConnectors = connector.connectorEndpoint.map((item, index) => {
        return {
          id: index,
          value: item,
        };
      });
      dispatch(setFilterConnectors(optionConnectors));
    } else {
      toast.warning('Connector not available', toastProps());
    }
  };

  // on option selected of company dropdown
  const onCompanyOptionChange = (value: IntOption | string) => {
    const payload = value as IntOption;
    dispatch(setSelectedFilterCompanyOption(payload));
    if (payload !== null) {
      getConnectorByBPN(payload.bpn);
    }
  };

  // TODO:: on blur bpn get the connectors
  const onBlurBPN = () => {
    if (filterSelectedBPN.length > 3) {
      getConnectorByBPN(filterSelectedBPN);
    } else {
      dispatch(setFilterConnectors([]));
    }
  };

  const init = () => {
    dispatch(setContractOffers([]));
    dispatch(setSelectedOffer(null));
    dispatch(setSelectedOffersList([]));
    setSelectionModel([]);
    dispatch(setSearchFilterByType('company'));
    dispatch(setSelectedFilterCompanyOption(null));
    dispatch(setFilterCompanyOptions([]));
    dispatch(setFilterProviderUrl(''));
    dispatch(setFilterSelectedBPN(''));
    dispatch(setFilterConnectors([]));
    dispatch(setFilterSelectedConnector(''));
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 py-6 px-10">
      <Typography variant="h4" py={4}>
        Consumer View {searchFilterByType}
      </Typography>
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={3}>
          <FormControl fullWidth sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select--search-label-small">Search By</InputLabel>
            <Select
              labelId="select--search-label-small"
              value={searchFilterByType}
              label="Select Search Type"
              fullWidth
              size="small"
              onChange={e => handleSearchTypeChange(e.target.value)}
            >
              <MenuItem value="company">Company Name</MenuItem>
              <MenuItem value="bpn">Business Partner Number</MenuItem>
              <MenuItem value="url">Connector URL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          {searchFilterByType === 'url' ? (
            <Input
              value={filterProviderUrl}
              type="url"
              onChange={e => dispatch(setFilterProviderUrl(e.target.value))}
              onKeyPress={handleKeypress}
              fullWidth
              size="small"
              label="Enter connector URL"
            />
          ) : (
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={7}>
                {searchFilterByType === 'bpn' ? (
                  <Input
                    value={filterSelectedBPN}
                    type="text"
                    onChange={e => dispatch(setFilterSelectedBPN(e.target.value))}
                    onBlur={() => onBlurBPN()}
                    fullWidth
                    size="small"
                    label="Enter Business Partner Number"
                  />
                ) : (
                  <Autocomplete
                    options={filterCompanyOptions}
                    includeInputInList
                    loading={filterCompanyOptionsLoading}
                    onChange={(event, value) => onCompanyOptionChange(value)}
                    onInputChange={debounce((event, newInputValue) => {
                      onChangeSearchInputValue(newInputValue);
                    }, 1000)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={option => {
                      return typeof option === 'string' ? option : `${option.value}`;
                    }}
                    renderInput={params => (
                      <Input {...params} label="Select a company name" placeholder="Search company name" fullWidth />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        key={option.bpn}
                        {...props}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'initial!important',
                          justifyContent: 'initial',
                        }}
                      >
                        <Typography variant="subtitle1">{option.value}</Typography>
                        <Typography variant="subtitle2">{option.bpn}</Typography>
                      </Box>
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="select--search-label-small">Select connector</InputLabel>
                  <Select
                    labelId="select--search-label-small"
                    label="Select connectors"
                    placeholder="Select connectors"
                    fullWidth
                    size="small"
                    value={filterSelectedConnector}
                    onChange={e => dispatch(setFilterSelectedConnector(e.target.value as string))}
                  >
                    {filterConnectors.length === 0 ? (
                      <MenuItem disabled value="">
                        <em>No connector available</em>
                      </MenuItem>
                    ) : (
                      <MenuItem disabled value="">
                        <em>Select connector</em>
                      </MenuItem>
                    )}
                    {filterConnectors.map(item => (
                      <MenuItem key={item.id} value={item.value}>
                        {item.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="medium"
            onClick={fetchConsumerDataOffers}
            disabled={
              ((searchFilterByType === 'bpn' || searchFilterByType === 'company') &&
                filterSelectedConnector.length === 0) ||
              (searchFilterByType === 'url' && filterProviderUrl.length === 0)
            }
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button variant="contained" size="small" onClick={checkoutSelectedOffers} disabled={!selectedOffersList.length}>
          Subscribe to selected
        </Button>
      </Box>
      <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
        <DataGrid
          autoHeight={true}
          getRowId={row => row.assetId}
          rows={contractOffers}
          onRowClick={onRowClick}
          columns={columns}
          loading={offersLoading}
          checkboxSelection
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onSelectionModelChange={newSelectionModel => {
            const selectedIDs = new Set(newSelectionModel);
            const selectedRowData = contractOffers.filter(row => selectedIDs.has(row.assetId.toString()));
            dispatch(setSelectedOffersList(selectedRowData));
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
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
      {isMultipleContractSubscription && (
        <>
          <OfferDetailsDialog
            open={isOpenOfferDialog}
            offerObj={selectedOffersList[0]}
            handleButtonEvent={handleDetailsButtonEvent}
            isMultiple
          />
          <ConfirmTermsDialog
            offerObj={{
              offers: selectedOffersList ? selectedOffersList : [],
              provider: selectedOffersList[0]?.publisher ? selectedOffersList[0].publisher : ' ',
              offerCount: selectedOffersList.length,
            }}
            isProgress={isOfferSubLoading}
            open={isOpenOfferConfirmDialog}
            handleButtonEvent={handleConfirmTermDialog}
          />
        </>
      )}
      {selectedOffer && (
        <>
          <OfferDetailsDialog
            open={isOpenOfferDialog}
            offerObj={selectedOffer}
            handleButtonEvent={handleDetailsButtonEvent}
          />
          <ConfirmTermsDialog
            offerObj={{
              offers: selectedOffer ? [selectedOffer] : [],
              provider: selectedOffer ? selectedOffer.publisher : ' ',
              offerCount: 0,
            }}
            isProgress={isOfferSubLoading}
            open={isOpenOfferConfirmDialog}
            handleButtonEvent={handleConfirmTermDialog}
          />
        </>
      )}
    </div>
  );
};
