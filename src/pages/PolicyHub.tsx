/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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

import { Input, SelectList, Tab, TabPanel, Tabs } from '@catena-x/portal-shared-components';
import { Box, Button, FormControl, Grid } from '@mui/material';
import { isArray, keys, pickBy } from 'lodash';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormLabelDescription from '../components/policies/FormLabelDescription';
import PolicySelection from '../components/policies/PolicySelection';
import { SELECT_POLICY_TYPES } from '../constants/policies';
import { prepareFormData } from '../features/provider/policies/actions';
import { useGetPolicyTemplateQuery } from '../features/provider/policies/apiSlice';
import { handlePolicyFormData, setPolicyDialog } from '../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { PolicyHubModel } from '../models/Polices.models';
import { ALPHA_NUM_REGEX } from '../utils/constants';

const PolicyHub = ({ onSubmit }: any) => {
  const { t } = useTranslation();
  const { useCaseNames } = useAppSelector(state => state.appSlice);
  const { policyFormData } = useAppSelector(state => state.policySlice);

  const { data, isSuccess } = useGetPolicyTemplateQuery({
    useCases: useCaseNames,
  });

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const dispatch = useAppDispatch();
  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    reset(policyFormData);
  }, [policyFormData, reset]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(prepareFormData({ data }));
    }
  }, [data, dispatch, isSuccess]);

  const formSubmit = (formOutput: any) => {
    onSubmit(PolicyHubModel.preparePayload(formOutput));
  };

  const renderFormField = (item: any, type: any) => {
    const firstAttribute = item?.attribute[0];
    if (!firstAttribute) return null;

    if (firstAttribute?.key === 'Regex') {
      return (
        <FormControl fullWidth sx={{ '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabelDescription title={item.technicalKey} description={item.description} />
          <Input
            placeholder="Enter a value"
            value={item.value}
            onChange={e => {
              const { value } = e.target;
              if (ALPHA_NUM_REGEX.test(value) || value === '') {
                dispatch(handlePolicyFormData({ value, type, key: item.technicalKey }));
              }
            }}
            helperText="Invalid input"
          />
        </FormControl>
      );
    } else if (SELECT_POLICY_TYPES.includes(firstAttribute?.key)) {
      return (
        <FormControl fullWidth sx={{ '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabelDescription title={item.technicalKey} description={item.description} />
          <SelectList
            keyTitle="value"
            defaultValue={item.value}
            items={item.attribute}
            variant="filled"
            label={''}
            placeholder="Select a value"
            type={'text'}
            disableClearable={false}
            onChangeItem={e => dispatch(handlePolicyFormData({ value: e, type, key: item.technicalKey }))}
          />
        </FormControl>
      );
    } else {
      return null;
    }
  };

  if (isSuccess) {
    const policyTypes = keys(pickBy(policyFormData, isArray));
    return (
      <form>
        <PolicySelection data={data} />
        <FormControl sx={{ mb: 3, width: 300 }}>
          <Controller
            name="policy_name"
            control={control}
            rules={{
              required: true,
              minLength: 3,
              maxLength: 30,
              pattern: ALPHA_NUM_REGEX,
            }}
            render={({ fieldState: { error } }) => (
              <Input
                value={policyFormData.policy_name}
                variant="filled"
                label={'Policy name'}
                placeholder={'Enter policy name'}
                type={'text'}
                error={!!error}
                onChange={e => {
                  const { value } = e.target;
                  if (ALPHA_NUM_REGEX.test(value) || value === '') {
                    dispatch(handlePolicyFormData({ value, type: 'policy_name', key: 'policy_name' }));
                  }
                }}
                helperText={'Name required (min. 3 characters)'}
              />
            )}
          />
        </FormControl>
        {/* Policy tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="polcy type tabs" sx={{ pt: 0 }}>
            {policyTypes?.map((type: string) => <Tab key={type} label={type} />)}
          </Tabs>
        </Box>
        <Box>
          {policyTypes?.map((type: string, i: number) => {
            return (
              <TabPanel key={type} index={i} value={activeTab}>
                <Grid container spacing={3}>
                  {policyFormData[type].map((item: any) => (
                    <Grid key={type + item.technicalKey} item xs={5}>
                      {renderFormField(item, type)}
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 1, mt: 4 }}>
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(formSubmit)}>
            {t('button.submit')}
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={() => dispatch(setPolicyDialog(false))}>
            {t('button.close')}
          </Button>
        </Box>
      </form>
    );
  } else return null;
};

export default PolicyHub;
