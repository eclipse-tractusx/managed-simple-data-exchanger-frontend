/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
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

import { Autocomplete, Box, FormControl, Grid, Stack } from '@mui/material';
import {
  Button,
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
import { debounce, inRange, isEmpty, uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import { setFfilterCompanyOptionsLoading, setFilterCompanyOptions } from '../../features/consumer/slice';
import { ILegalEntityContent, IntOption } from '../../features/consumer/types';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { useValidateBpnMutation } from '../../features/provider/policies/apiSlice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import ConsumerService from '../../services/ConsumerService';
import { Config } from '../../utils/config';
import { ALPHA_NUM_REGEX, BPN_TYPE_FIELDS } from '../../utils/constants';

function ValidateBpn({ control, resetField, getValues, setValue, inputBpn }: any) {
  const [searchPopup, setsearchPopup] = useState(false);
  const [selectType, setSelectType] = useState(BPN_TYPE_FIELDS[0]);
  const [conKey, setConKey] = useState(uuid());

  const [addBpnPrompt, setAddBpnPrompt] = useState(false);
  const { replace } = useFieldArray({ name: 'access_policies.bpn_numbers.value', control });

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [validateBpn, { isLoading, data }] = useValidateBpnMutation();
  const { filterCompanyOptions, filterCompanyOptionsLoading } = useAppSelector(state => state.consumerSlice);

  const addBpn = () => {
    if (inputBpn) {
      setValue(
        'access_policies.bpn_numbers.value',
        uniq([...getValues('access_policies.bpn_numbers.value'), inputBpn]),
      );
      resetField('inputBpn', { defaultValue: '' });
    }
  };
  const deleteBpn = (bpn: string) => {
    if (bpn !== Config.REACT_APP_DEFAULT_COMPANY_BPN) {
      const newList = getValues('access_policies.bpn_numbers.value').filter((item: string) => item !== bpn);
      replace(newList);
    }
  };

  const onFormSubmit = async () => {
    if (!inRange(inputBpn.length, 1, 16)) {
      await validateBpn(inputBpn);
      setConKey(uuid());
    }
  };

  useEffect(() => {
    if (data?.bpnStatus === 'FULL_PARTNER') {
      dispatch(setSnackbarMessage({ message: data?.msg, type: 'success' }));
      setValue(
        'access_policies.bpn_numbers.value',
        uniq([...getValues('access_policies.bpn_numbers.value'), inputBpn]),
      );
    } else if (data?.bpnStatus === 'PARTNER') setAddBpnPrompt(true);
    else if (data?.bpnStatus === 'NOT_PARTNER') dispatch(setSnackbarMessage({ message: data?.msg, type: 'error' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch]);

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

  return (
    <>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={4}>
          <SelectList
            keyTitle="title"
            label={t('content.consumeData.selectType')}
            fullWidth
            size="small"
            onChangeItem={e => {
              setSelectType(e);
              resetField('inputBpn', { defaultValue: '' });
            }}
            items={BPN_TYPE_FIELDS}
            defaultValue={selectType}
            placeholder={t('content.consumeData.selectType')}
            disableClearable
          />
        </Grid>
        <Grid item xs={4}>
          {selectType.value === 'bpn' ? (
            <FormControl fullWidth>
              <Controller
                name="inputBpn"
                control={control}
                rules={{
                  validate: val => {
                    if (inRange(val.length, 1, 16)) {
                      return val;
                    }
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label={t('content.consumeData.enterBPN')}
                    placeholder={t('content.consumeData.enterBPN')}
                    variant="filled"
                    value={field.value}
                    inputProps={{ maxLength: 16 }}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '' || ALPHA_NUM_REGEX.test(value)) {
                        field.onChange(e);
                      }
                    }}
                    error={!!error}
                    helperText="Incorrect BPN"
                  />
                )}
              />
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <Controller
                name="inputBpn"
                control={control}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    key={conKey}
                    open={searchPopup}
                    options={filterCompanyOptions}
                    includeInputInList
                    loading={filterCompanyOptionsLoading}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e, value: any) => onChange(value.bpn)}
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
              />
            </FormControl>
          )}
        </Grid>
        <Grid item>
          <LoadingButton
            sx={{ ml: 1, mt: 2 }}
            variant="contained"
            label={t('button.add')}
            onButtonClick={() => onFormSubmit()}
            loading={isLoading}
            loadIndicator={t('content.common.loading')}
            disabled={isEmpty(inputBpn)}
          />
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <Typography variant="body2" mb={2}>
          <i> {t('content.policies.note')}</i>
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {getValues('access_policies.bpn_numbers.value')?.map((bpnNum: string) => (
            <Chip
              color="secondary"
              label={bpnNum}
              key={bpnNum + 1}
              onClick={() => deleteBpn(bpnNum)}
              withIcon={bpnNum !== Config.REACT_APP_DEFAULT_COMPANY_BPN}
            />
          ))}
        </Stack>
      </Box>
      {addBpnPrompt ? (
        <Dialog open={addBpnPrompt}>
          <DialogHeader title={t('content.consumeData.noConnectors')} />
          <DialogContent>{data?.msg}</DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setAddBpnPrompt(false);
              }}
            >
              {t('button.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                addBpn();
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

export default ValidateBpn;
