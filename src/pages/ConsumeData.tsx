/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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
} from '@catena-x/portal-shared-components';
import { Autocomplete, Box, Grid, LinearProgress } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbar,
  GridValidRowModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { debounce, isEmpty, isEqual, map, pick } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import ConfirmTermsDialog from '../components/dialogs/ConfirmTermsDialog';
import OfferDetailsDialog from '../components/dialogs/OfferDetailsDialog';
import NoDataPlaceholder from '../components/NoDataPlaceholder';
import Permissions from '../components/Permissions';
import { useGetOfferPolicyDetailsMutation } from '../features/consumer/apiSlice';
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
  setOpenOfferConfirmDialog,
  setOpenOfferDetailsDialog,
  setSearchFilterByType,
  setSelectedFilterCompanyOption,
  setSelectedOffer,
  setSelectedOffersList,
} from '../features/consumer/slice';
import {
  IConnectorResponse,
  IConsumerDataOffers,
  ILegalEntityContent,
  IntConnectorItem,
  IntOption,
} from '../features/consumer/types';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { handleBlankCellValues, MAX_CONTRACTS_AGREEMENTS } from '../helpers/ConsumerOfferHelper';
import ConsumerService from '../services/ConsumerService';

const ITEMS: IntConnectorItem[] = [
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
    openOfferDetailsDialog,
  } = useAppSelector(state => state.consumerSlice);
  const [offerSubLoading, setOfferSubLoading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [conKey, setConKey] = useState(uuid());
  const [bpnError, setBpnError] = useState(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [getPolicyDetails] = useGetOfferPolicyDetailsMutation();

  const columns: GridColDef[] = [
    {
      field: 'title',
      flex: 1,
      headerName: t('content.consumeData.columns.title'),
    },
    {
      field: 'publisher',
      flex: 1,
      headerName: t('content.consumeData.columns.publisher'),
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.consumeData.columns.assetId'),
    },
    {
      field: 'sematicVersion',
      flex: 1,
      headerName: t('content.consumeData.columns.sematicVersion'),
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
    dispatch(setOpenOfferDetailsDialog(flag));
    if (flag === false) {
      dispatch(setSelectedOffer(null));
    }
  };

  const preparePayload = () => {
    const selectedList = isMultipleContractSubscription ? selectedOffersList : [selectedOffer];
    const offersList = selectedList.map((offer: any) => ({
      connectorId: offer.connectorId,
      connectorOfferUrl: offer.connectorOfferUrl,
      offerId: offer.offerId || '',
      assetId: offer.assetId || '',
      policyId: offer.policyId || '',
    }));
    return {
      offers: offersList,
      usage_policies: selectedList[0].policy.Usage,
    };
  };

  const handleConfirmTermDialog = async () => {
    try {
      setOfferSubLoading(true);

      const handleSuccess = () => {
        dispatch(setOpenOfferDetailsDialog(false));
        dispatch(setOpenOfferConfirmDialog(false));
        dispatch(setIsMultipleContractSubscription(false));
        dispatch(setSelectedOffer(null));
        dispatch(setSelectedOffersList([]));
        setSelectionModel([]);
      };

      const response = await ConsumerService.getInstance().subscribeToOffers(preparePayload());

      if (response.status === 200) {
        dispatch(setSnackbarMessage({ message: 'alerts.subscriptionSuccess', type: 'success' }));
        handleSuccess();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOfferSubLoading(false);
    }
  };

  const fetchConsumerDataOffers = async () => {
    try {
      let providerUrl = '';
      if (searchFilterByType.value === 'company' || searchFilterByType.value === 'bpn') {
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
  const handleKeypress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'NumpadEnter'].includes(e.key)) {
      await fetchConsumerDataOffers();
    }
  };
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const showAddDialog = () => {
    setDialogOpen(prev => !prev);
  };

  const checkoutSelectedOffers = async (offers: IConsumerDataOffers[]) => {
    try {
      const extractedData = map(offers, item => pick(item, ['assetId', 'connectorOfferUrl', 'publisher']));
      const offerDetails = await getPolicyDetails(extractedData).unwrap();
      const mergeSelectedOffers: IConsumerDataOffers[] = offerDetails.map((policyOffer: IConsumerDataOffers) => ({
        ...policyOffer,
        ...offers.find((orgOffer: IConsumerDataOffers) => orgOffer.assetId === policyOffer.assetId),
      }));
      dispatch(setSelectedOffersList(mergeSelectedOffers));

      if (offerDetails.length === 1) {
        dispatch(setIsMultipleContractSubscription(false));
        dispatch(setSelectedOffer(mergeSelectedOffers[0]));
        toggleDialog(true);
        return;
      }

      const usagePolicies: IConsumerDataOffers[] = offerDetails.map((offer: IConsumerDataOffers) =>
        isEmpty(offer.policy.Usage) ? [] : offer.policy.Usage,
      );
      const isUsagePoliciesEqual = usagePolicies.every((item, index, array) => isEqual(item, array[0]));
      if (isUsagePoliciesEqual) {
        dispatch(setOpenOfferDetailsDialog(true));
        dispatch(setIsMultipleContractSubscription(true));
      } else {
        dispatch(setOpenOfferDetailsDialog(false));
        showAddDialog();
        dispatch(setIsMultipleContractSubscription(false));
      }
    } catch (error) {
      console.log('getPolicyDetails', error);
    }
  };

  const onRowClick = (params: GridValidRowModel) => {
    checkoutSelectedOffers([params.row]);
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
  const handleSearchTypeChange = (value: IntConnectorItem) => {
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
      } else {
        dispatch(setSnackbarMessage({ message: 'alerts.noConnector', type: 'error' }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // on option selected of company dropdown
  const onCompanyOptionChange = async (value: IntOption | string) => {
    const payload = value as IntOption;
    dispatch(setSelectedFilterCompanyOption(payload));
    if (payload !== null) {
      await getConnectorByBPN(payload.bpn);
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
    dispatch(setSearchFilterByType(ITEMS[0]));
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

  const handleBPNchange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /[a-zA-Z0-9]$/;
    const { value } = e.target;
    if (value === '' || regex.test(value)) {
      dispatch(setFilterSelectedBPN(value));
      if (value.length == 16) {
        getConnectorByBPN(value);
      }
    }
  };

  useEffect(() => {
    if (filterSelectedBPN.length == 16 || filterSelectedBPN.length == 0) setBpnError(false);
    else setBpnError(true);
  }, [filterSelectedBPN]);

  const renderOfferDialogs = (offerObj: IConsumerDataOffers, offerCount: number) => (
    <>
      <OfferDetailsDialog offerObj={offerObj} isMultiple={offerCount > 1} />
      <ConfirmTermsDialog
        offerObj={{
          offers: offerCount > 0 ? [offerObj] : [],
          provider: offerObj?.publisher || '',
          offerCount: offerCount,
        }}
        isProgress={offerSubLoading}
        handleConfirm={handleConfirmTermDialog}
      />
    </>
  );

  return (
    <>
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
            placeholder={t('content.consumeData.selectType')}
            defaultValue={searchFilterByType}
            items={ITEMS}
            onChangeItem={e => handleSearchTypeChange(e)}
            disableClearable={true}
          />
        </Grid>
        <Grid item xs={6}>
          {searchFilterByType.value === 'url' ? (
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
                {searchFilterByType.value === 'bpn' ? (
                  <Input
                    value={filterSelectedBPN}
                    type="text"
                    fullWidth
                    size="small"
                    label={t('content.consumeData.enterBPN')}
                    placeholder={t('content.consumeData.enterBPN')}
                    inputProps={{ maxLength: 16 }}
                    error={bpnError}
                    onChange={handleBPNchange}
                    helperText={t('alerts.bpnValidation')}
                  />
                ) : (
                  <Autocomplete
                    open={searchOpen}
                    options={filterCompanyOptions}
                    includeInputInList
                    loading={filterCompanyOptionsLoading}
                    onChange={async (event, value: any) => {
                      await onCompanyOptionChange(value);
                      setConKey(uuid());
                    }}
                    onInputChange={debounce(async (event, newInputValue) => {
                      await onChangeSearchInputValue(newInputValue);
                    })}
                    onSelect={() => setSearchOpen(false)}
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
                  disabled={!filterConnectors.length}
                  keyTitle="title"
                  label={t('content.consumeData.selectConnectors')}
                  placeholder={t('content.consumeData.selectConnectors')}
                  noOptionsText={t('content.consumeData.noConnectors')}
                  defaultValue={filterSelectedConnector}
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
              disabled={isEmpty(filterSelectedConnector) && isEmpty(filterProviderUrl)}
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
            onClick={() => checkoutSelectedOffers(selectedOffersList)}
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
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onSelectionModelChange={newSelectionModel => handleSelectionModel(newSelectionModel)}
            selectionModel={selectionModel}
            isRowSelectable={params => params.row.type !== 'PCFExchangeEndpoint'}
            components={{
              Toolbar: GridToolbar,
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
              NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
            }}
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            disableColumnFilter
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
      {openOfferDetailsDialog && renderOfferDialogs(selectedOffersList[0], selectedOffersList.length)}
      <Dialog open={dialogOpen}>
        <DialogHeader title={t('dialog.samePolicies.title')} />
        <DialogContent>{t('dialog.samePolicies.content')}</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={showAddDialog}>
            {t('button.okay')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
