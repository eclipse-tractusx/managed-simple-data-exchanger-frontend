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

import { Box } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { setDuration, setDurationValue, setPurpose } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import UsagePolicyItem from './UsagePolicyItem';

export default function UsagePolicy() {
  const { duration, durationValue, purpose } = useAppSelector(state => state.accessUsagePolicySlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t('content.policies.usagePolicy')}</Typography>
      <Box sx={{ mt: 2 }}>
        <UsagePolicyItem
          restrictionType={duration}
          setRestrictionType={e => dispatch(setDuration(e))}
          constraintType={t('content.policies.duration')}
          displayText={t('content.policies.durationNote')}
          labelText={t('content.common.enterValue')}
          inputFreeText={durationValue}
          setInputFreeText={e => dispatch(setDurationValue(e))}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={purpose}
          setRestrictionType={e => dispatch(setPurpose(e))}
          constraintType={t('content.policies.purpose')}
          displayText={t('content.policies.purposeNote')}
          labelText={t('content.policies.purposeLabel')}
        />
      </Box>
      {/* <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={role}
          setRestrictionType={e => dispatch(setRole(e))}
          constraintType={t('content.policies.role')}
          displayText={t('content.policies.roleNote')}
          labelText={t('content.policies.roleLabel')}
          inputFreeText={roleValue}
          setInputFreeText={e => dispatch(setRoleValue(e))}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={custom}
          setRestrictionType={e => dispatch(setCustom(e))}
          constraintType={t('content.policies.custom')}
          displayText={t('content.policies.customNote')}
          labelText={t('content.policies.customLabel')}
          inputFreeText={customValue}
          setInputFreeText={e => dispatch(setCustomValue(e))}
        />
      </Box> */}
    </>
  );
}
