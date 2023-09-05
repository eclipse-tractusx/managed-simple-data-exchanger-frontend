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

import { Autocomplete, Box, Button, debounce, Grid, Stack } from '@mui/material';
import {
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Input,
  LoadingButton,
  SelectList,
  Typography,
} from 'cx-portal-shared-components';
import { inRange, isEmpty } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import { setFfilterCompanyOptionsLoading, setFilterCompanyOptions } from '../../features/consumer/slice';
import { ILegalEntityContent, IntConnectorItem, IntOption } from '../../features/consumer/types';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { useValidateBpnMutation } from '../../features/provider/policies/apiSlice';
import { addBpn, deleteBpn, setInputBpn } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import ConsumerService from '../../services/ConsumerService';
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
];

export default function AccessPolicy() {
  const { bpnList, inputBpn } = useAppSelector(state => state.accessUsagePolicySlice);
  const { filterCompanyOptions, filterCompanyOptionsLoading } = useAppSelector(state => state.consumerSlice);
  const [searchFilterByType, setsearchFilterByType] = useState<IntConnectorItem>({
    id: 1,
    title: 'Company Name',
    value: 'company',
  });
  const [searchPopup, setsearchPopup] = useState(false);
  const [bpnError, setbpnError] = useState(false);
  const [conKey, setConKey] = useState(uuid());

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // get company name on input change
  const onChangeSearchInputValue = async (params: string) => {
    const searchStr = params.toLowerCase();
    if (searchStr.length > 2) {
      setsearchPopup(true);
      dispatch(setFilterCompanyOptions([]));
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
      setsearchPopup(false);
      dispatch(setFilterCompanyOptions([]));
    }
  };

  const handleSearchTypeChange = (value: IntConnectorItem) => {
    setsearchFilterByType(value);
    dispatch(setInputBpn(''));
  };

  const [validateBpn, { isLoading, data }] = useValidateBpnMutation();
  const [addBpnPrompt, setAddBpnPrompt] = useState(false);
  const handleAddBpn = async () => {
    if (inRange(inputBpn.length, 1, 16)) {
      setbpnError(true);
    } else {
      setbpnError(false);
      await validateBpn(inputBpn);
      setConKey(uuid());
    }
  };
  const handleEnterBpn = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /[a-zA-Z0-9]$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      dispatch(setInputBpn(e.target.value));
    }
  };

  useEffect(() => {
    if (data?.bpnStatus === 'FULL_PARTNER') {
      dispatch(setSnackbarMessage({ message: data?.msg, type: 'success' }));
      dispatch(addBpn());
    } else if (data?.bpnStatus === 'PARTNER') setAddBpnPrompt(true);
    else if (data?.bpnStatus === 'NOT_PARTNER') dispatch(setSnackbarMessage({ message: data?.msg, type: 'error' }));
  }, [data, dispatch]);

  useEffect(() => {
    if (inputBpn.length == 16 || inputBpn.length == 0) setbpnError(false);
  }, [inputBpn]);

  return (
    <>
      <Typography fontWeight={'bold'}>{t('content.policies.accessPolicy')}</Typography>
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={5}>
          <SelectList
            keyTitle="title"
            label={t('content.consumeData.selectType')}
            fullWidth
            size="small"
            onChangeItem={e => handleSearchTypeChange(e)}
            items={ITEMS}
            defaultValue={searchFilterByType}
            disableClearable={true}
            placeholder={t('content.consumeData.selectType')}
          />
        </Grid>
        <Grid item xs={4}>
          {searchFilterByType.value === 'bpn' ? (
            <Input
              label={t('content.consumeData.enterBPN')}
              placeholder={t('content.consumeData.enterBPN')}
              size="small"
              value={inputBpn}
              inputProps={{ maxLength: 16 }}
              onChange={handleEnterBpn}
              error={bpnError}
              helperText="Incorrect BPN"
            />
          ) : (
            <Autocomplete
              key={conKey}
              open={searchPopup}
              options={filterCompanyOptions}
              includeInputInList
              loading={filterCompanyOptionsLoading}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e, value: any) => dispatch(setInputBpn(value.bpn))}
              onInputChange={debounce(async (event, newInputValue) => {
                await onChangeSearchInputValue(newInputValue);
              }, 1000)}
              onClose={() => setsearchPopup(false)}
              onBlur={() => setsearchPopup(false)}
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
              renderOption={(props, option: IntOption) => (
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
            />
          )}
        </Grid>
        <Grid item>
          <LoadingButton
            sx={{ marginLeft: 1 }}
            variant="contained"
            label={t('button.add')}
            onButtonClick={handleAddBpn}
            loadIndicator={t('content.common.loading')}
            loading={isLoading}
            disabled={isEmpty(inputBpn)}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        {isEmpty(bpnList) ? (
          <Box mb={2}>
            <Alert severity="warning" width="90%">
              <span>{t('content.policies.warningText')}</span>
            </Alert>
          </Box>
        ) : null}
        <Typography variant="body2">
          <i> {t('content.policies.note')}</i>
        </Typography>
        <Stack direction="row" spacing={1} mt={bpnList.length ? 3 : 0} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {bpnList.map((bpnNum: string) => (
            <Chip color="secondary" label={bpnNum} key={bpnNum + 1} onClick={() => dispatch(deleteBpn(bpnNum))} />
          ))}
        </Stack>
      </Box>
      <hr style={{ marginBottom: 50, marginTop: 30 }} />
      {addBpnPrompt ? (
        <Dialog open={addBpnPrompt}>
          <DialogHeader title={t('content.consumeData.noConnectors')} />
          <DialogContent>{data.msg}</DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setAddBpnPrompt(false);
              }}
            >
              {t('button.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(addBpn());
                setAddBpnPrompt(false);
              }}
            >
              {t('button.add')}
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
}