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
import { Autocomplete, Box, Grid, LinearProgress, Stack } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbar,
  GridValidRowModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Input,
  LoadingButton,
  SelectList,
  Typography,
} from 'cx-portal-shared-components';
import { debounce } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import ConfirmTermsDialog from '../components/dialogs/ConfirmTermsDialog';
import OfferDetailsDialog from '../components/dialogs/OfferDetailsDialog';
import Permissions from '../components/Permissions';
import {
  setContractOffers,
  setFfilterCompanyOptionsLoading,
  setFilterCompanyOptions,
  setFilterConnectors,
  setFilterProviderUrl,
  setFilterSelectedBPN,
  setFilterSelectedConnector,
  setIsMultipleContractSubscription,
  setOffersLoading,
  setSearchFilterByType,
  setSelectedFilterCompanyOption,
  setSelectedOffer,
  setSelectedOffersList,
} from '../features/consumer/slice';
import { IConnectorResponse, IConsumerDataOffers, ILegalEntityContent, IntOption } from '../features/consumer/types';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { arraysEqual, handleBlankCellValues, MAX_CONTRACTS_AGREEMENTS } from '../helpers/ConsumerOfferHelper';
import ConsumerService from '../services/ConsumerService';

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

export default function ConsumeData() {
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [conKey, setConKey] = useState(uuid());
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'title',
      flex: 1,
      headerName: t('content.consumeData.columns.title'),
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.consumeData.columns.assetId'),
    },
    {
      field: 'created',
      flex: 1,
      headerName: t('content.consumeData.columns.created'),
      sortingOrder: ['desc', 'asc'],
      sortComparator: (_v1: any, _v2: any, param1: any, param2: any) => param1.id - param2.id,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.created),
    },
    {
      field: 'description',
      flex: 1,
      editable: false,
      headerName: t('content.consumeData.columns.description'),
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
          selectedOffersList.forEach((offer: IConsumerDataOffers) => {
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
                ? filterSelectedConnector.value
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
                ? filterSelectedConnector.value
                : filterProviderUrl,
            offers: offersList,
            policies: usagePolicies,
          };
        }
        setIsOfferSubLoading(true);
        const response = await ConsumerService.getInstance().subscribeToOffers(payload);
        setIsOfferSubLoading(false);
        if (response.status == 200) {
          dispatch(
            setSnackbarMessage({
              message: 'alerts.subscriptionSuccess',
              type: 'success',
            }),
          );
          setIsOpenOfferDialog(false);
          setIsOpenOfferConfirmDialog(false);
          dispatch(setIsMultipleContractSubscription(false));
          dispatch(setSelectedOffer(null));
          dispatch(setSelectedOffersList([]));
          setSelectionModel([]);
        }
      } catch (error: any) {
        setIsOfferSubLoading(false);
        const data = error?.data;
        const errorMessage = data?.msg;
        if (errorMessage) {
          dispatch(
            setSnackbarMessage({
              message: errorMessage,
              type: 'error',
            }),
          );
        } else {
          dispatch(
            setSnackbarMessage({
              message: 'alerts.subscriptionError',
              type: 'error',
            }),
          );
        }
      }
    }
  };

  const onRowClick = (params: any) => {
    dispatch(setSelectedOffer(params.row));
    toggleDialog(true);
  };

  const fetchConsumerDataOffers = async () => {
    try {
      let providerUrl = '';
      if (searchFilterByType === 'company' || searchFilterByType === 'bpn') {
        providerUrl = filterSelectedConnector.value;
      } else {
        providerUrl = filterProviderUrl;
      }
      if (providerUrl == '' || providerUrl == null) {
        return true;
      }
      dispatch(setOffersLoading(true));
      const response = await ConsumerService.getInstance().fetchConsumerDataOffers({
        providerUrl: providerUrl,
        offset: 0,
        maxLimit: MAX_CONTRACTS_AGREEMENTS,
      });
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
  const [dialogOpen, setdialogOpen] = useState<boolean>(false);
  const showAddDialog = () => {
    setdialogOpen(prev => !prev);
  };

  const checkoutSelectedOffers = () => {
    let isUsagePoliciesEqual = false;
    const useCasesList: any[] = [];
    selectedOffersList.forEach((offer: IConsumerDataOffers) => {
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
      showAddDialog();
      setIsOpenOfferDialog(false);
      dispatch(setIsMultipleContractSubscription(false));
    }
  };

  // get company name oninput change
  const onChangeSearchInputValue = async (params: string) => {
    const searchStr = params.toLowerCase();
    if (searchStr.length > 2) {
      if (open) setSearchOpen(true);
      dispatch(setFilterCompanyOptions([]));
      dispatch(setFilterSelectedConnector(null));
      dispatch(setFfilterCompanyOptionsLoading(true));
      const res: [] = await ConsumerService.getInstance().searchLegalEntities(searchStr);
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
      setSearchOpen(false);
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
    dispatch(setFilterSelectedConnector(null));
    setConKey(uuid());
  };

  const getConnectorByBPN = async (bpn: string) => {
    const payload = [];
    payload.push(bpn);
    dispatch(setFilterSelectedConnector(null));
    dispatch(setFilterConnectors([]));
    try {
      const res = await ConsumerService.getInstance().searchConnectoByBPN(payload);
      if (res.length) {
        const resC: IConnectorResponse[] = res;
        const connector = resC[0];
        const optionConnectors = connector.connectorEndpoint.map((item, index) => {
          return {
            id: index,
            value: item,
            title: item,
          };
        });
        dispatch(setFilterConnectors(optionConnectors));
      }
    } catch (error: any) {
      const data = error?.data;
      const errorMessage = data?.msg;
      if (errorMessage) {
        dispatch(
          setSnackbarMessage({
            message: errorMessage,
            type: 'error',
          }),
        );
      } else {
        dispatch(
          setSnackbarMessage({
            message: 'alerts.noConnector',
            type: 'error', //warning
          }),
        );
      }
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

  const onBlurBPN = () => {
    if (filterSelectedBPN.length > 3) {
      getConnectorByBPN(filterSelectedBPN);
    } else {
      dispatch(setFilterConnectors([]));
    }
  };

  const handleSelectionModel = (newSelectionModel: GridSelectionModel) => {
    const selectedIDs = new Set(newSelectionModel);
    const selectedRowData = contractOffers.filter((row: GridValidRowModel) => selectedIDs.has(row.id));
    dispatch(setSelectedOffersList(selectedRowData));
    setSelectionModel(newSelectionModel);
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
    dispatch(setFilterSelectedConnector(null));
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Typography variant="h3" mb={1}>
        {t('pages.consumeData')}
      </Typography>
      <Typography variant="body1" mb={4} maxWidth={900}>
        {t('content.consumeData.description')}
      </Typography>
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={3}>
          <SelectList
            keyTitle="title"
            label={t('content.consumeData.selectType')}
            fullWidth
            size="small"
            onChangeItem={e => handleSearchTypeChange(e ? e.value : '')}
            items={ITEMS}
            defaultValue={ITEMS[0]}
            disableClearable={true}
            placeholder={t('content.consumeData.selectType')}
            value={searchFilterByType}
            hiddenLabel
          />
        </Grid>
        <Grid item xs={6}>
          {searchFilterByType === 'url' ? (
            <Input
              value={filterProviderUrl}
              type="url"
              onChange={e => dispatch(setFilterProviderUrl(e.target.value))}
              onKeyPress={handleKeypress}
              fullWidth
              size="small"
              label={t('content.consumeData.enterURL')}
              placeholder={t('content.consumeData.enterURL')}
            />
          ) : (
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={7}>
                {searchFilterByType === 'bpn' ? (
                  <Input
                    value={filterSelectedBPN}
                    type="text"
                    onBlur={() => onBlurBPN()}
                    fullWidth
                    size="small"
                    label={t('content.consumeData.enterBPN')}
                    placeholder={t('content.consumeData.enterBPN')}
                    inputProps={{ maxLength: 16 }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const regex = /[a-zA-Z0-9]$/;
                      if (e.target.value === '' || regex.test(e.target.value)) {
                        dispatch(setFilterSelectedBPN(e.target.value));
                      }
                    }}
                  />
                ) : (
                  <Autocomplete
                    open={searchOpen}
                    options={filterCompanyOptions}
                    includeInputInList
                    loading={filterCompanyOptionsLoading}
                    onChange={(event, value: any) => {
                      onCompanyOptionChange(value);
                      setConKey(uuid());
                    }}
                    onInputChange={debounce((event, newInputValue) => {
                      onChangeSearchInputValue(newInputValue);
                    }, 1000)}
                    onBlur={() => setSearchOpen(false)}
                    onClose={() => setSearchOpen(false)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={option => {
                      return typeof option === 'string' ? option : `${option.value}`;
                    }}
                    noOptionsText={t('content.consumeData.noCompany')}
                    renderInput={params => (
                      <Input
                        {...params}
                        label={t('content.consumeData.searchCompany')}
                        placeholder={t('content.consumeData.searchPlaceholder')}
                        fullWidth
                      />
                    )}
                    renderOption={(props, option: any) => (
                      <Box
                        component="li"
                        {...props}
                        key={option.bpn}
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
                    sx={{
                      '& .MuiFilledInput-root': {
                        pt: '0px!important',
                        minHeight: '55px',
                      },
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={5}>
                <SelectList
                  key={conKey}
                  disabled={!Boolean(filterConnectors.length)}
                  keyTitle="title"
                  label={t('content.consumeData.selectConnectors')}
                  placeholder={t('content.consumeData.selectConnectors')}
                  noOptionsText={t('content.consumeData.noConnectors')}
                  fullWidth
                  size="small"
                  onChangeItem={e => dispatch(setFilterSelectedConnector(e))}
                  items={filterConnectors}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Permissions values={['consumer_search_connectors']}>
            <LoadingButton
              color="primary"
              variant="contained"
              disabled={
                filterSelectedConnector ? filterSelectedConnector.value === '' : false || filterProviderUrl.length === 0
              }
              label={t('button.search')}
              loadIndicator={t('content.common.loading')}
              onButtonClick={fetchConsumerDataOffers}
              loading={offersLoading}
              sx={{ ml: 3 }}
            />
          </Permissions>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" my={3}>
        <Permissions values={['consumer_establish_contract_agreement']}>
          <Button
            variant="contained"
            size="small"
            onClick={checkoutSelectedOffers}
            disabled={!selectedOffersList.length}
          >
            {t('button.subscribeSelected')}
          </Button>
        </Permissions>
      </Box>
      <Permissions values={['consumer_view_contract_offers']}>
        <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
          <DataGrid
            autoHeight={true}
            getRowId={row => row.id}
            rows={contractOffers}
            onRowClick={onRowClick}
            columns={columns}
            loading={offersLoading}
            checkboxSelection
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onSelectionModelChange={newSelectionModel => handleSelectionModel(newSelectionModel)}
            selectionModel={selectionModel}
            components={{
              Toolbar: GridToolbar,
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {t('content.common.noData')}
                </Stack>
              ),
              NoResultsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {t('content.common.noResults')}
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
              '& .MuiDataGrid-columnHeaderCheckbox': {
                height: 'auto !important',
              },
            }}
          />
        </Box>
      </Permissions>
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
      <Dialog open={dialogOpen}>
        <DialogHeader title={t('dialog.samePolicies.title')} />
        <DialogContent>{t('dialog.samePolicies.content')}</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={showAddDialog}>
            {t('button.okay')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
