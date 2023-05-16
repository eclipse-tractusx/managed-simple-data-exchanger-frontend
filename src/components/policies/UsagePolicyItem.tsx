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

import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { Input, SelectList } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { setDurationUnit, setPurposeValue } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { DURATION_UNITS, PURPOSE_VALUES } from '../../utils/constants';

interface FreeTextProps {
  restrictionType: string;
  setRestrictionType: (restrictionType: string) => void;
  constraintType: string;
  displayText: string;
  inputFreeText?: string;
  labelText: string;
  setInputFreeText?: (freeText: string) => void;
}

export default function UsagePolicyItem({
  restrictionType,
  setRestrictionType,
  constraintType,
  displayText,
  inputFreeText,
  labelText,
  setInputFreeText,
}: FreeTextProps) {
  const { durationUnit, purposeValue } = useAppSelector(state => state.accessUsagePolicySlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  function checkErrors() {
    if (constraintType === t('content.policies.duration')) {
      const result = /^[1-9]\d*$/.test(inputFreeText);
      return !result;
    } else if (restrictionType === 'RESTRICTED' && inputFreeText === '') {
      return true;
    }
  }
  return (
    <Box component="form" noValidate autoComplete="off">
      <FormLabel sx={{ mb: 2 }}>{constraintType}</FormLabel>
      <RadioGroup row value={restrictionType} onChange={e => setRestrictionType(e.target.value)}>
        <FormControlLabel value="UNRESTRICTED" control={<Radio />} label={t('content.policies.unrestricted')} />
        <FormControlLabel value="RESTRICTED" control={<Radio />} label={t('content.policies.restricted')} />
      </RadioGroup>

      <Box>
        {restrictionType === 'RESTRICTED' && (
          <>
            <FormLabel sx={{ my: 1, display: 'block' }}>{displayText}</FormLabel>
            <Stack direction="row" alignItems={'flex-end'} spacing={2}>
              {constraintType !== t('content.policies.purpose') && (
                <Input
                  label={labelText}
                  placeholder={labelText}
                  size="small"
                  type={constraintType === t('content.policies.duration') ? 'number' : 'text'}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  value={inputFreeText}
                  required
                  error={checkErrors()}
                  onChange={e => {
                    setInputFreeText(e.target.value);
                  }}
                  sx={{ minWidth: 250 }}
                />
              )}
              {constraintType === t('content.policies.duration') && (
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <SelectList
                    keyTitle="title"
                    value={durationUnit}
                    defaultValue={DURATION_UNITS[0]}
                    items={DURATION_UNITS}
                    label={t('content.policies.selectDuration')}
                    placeholder={t('content.policies.selectDuration')}
                    disableClearable={true}
                    onChangeItem={e => {
                      dispatch(setDurationUnit(e.value));
                    }}
                  />
                </FormControl>
              )}
              {constraintType === t('content.policies.purpose') && (
                <FormControl sx={{ minWidth: 250 }} size="small">
                  <SelectList
                    keyTitle="title"
                    value={purposeValue}
                    defaultValue={purposeValue}
                    items={PURPOSE_VALUES}
                    label={t('content.policies.purposeLabel')}
                    placeholder={t('content.policies.purposeLabel')}
                    disableClearable={true}
                    onChangeItem={e => {
                      dispatch(setPurposeValue(e));
                    }}
                    error={checkErrors()}
                  />
                </FormControl>
              )}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}
