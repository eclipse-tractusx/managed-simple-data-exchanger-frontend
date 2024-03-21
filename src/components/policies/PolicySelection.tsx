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

import { Box, FormControl } from '@mui/material';
import { SelectList } from 'cx-portal-shared-components';
import { useEffect, useState } from 'react';

import { NEW_POLICY_ITEM } from '../../constants/policies';
import { prepareFormData } from '../../features/provider/policies/actions';
import { useGetPoliciesQuery, useGetSinglePolicyMutation } from '../../features/provider/policies/apiSlice';
import { setPolicyData, setSelectedPolicy } from '../../features/provider/policies/slice';
import { PolicyHubResponse } from '../../features/provider/policies/types';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { ISelectList } from '../../models/Common';

function PolicySelection({ data }: { data: PolicyHubResponse[] }) {
  const { policyDialogType, selectedPolicy } = useAppSelector(state => state.policySlice);
  const showPolicySelection = policyDialogType === 'FileWithPolicy' || policyDialogType === 'TableWithPolicy';
  const [policyList, setPolicyList] = useState([]);
  const dispatch = useAppDispatch();

  const { data: policyListResponse, isSuccess: isPolicyDataSuccess } = useGetPoliciesQuery(
    {},
    { skip: !showPolicySelection },
  );
  const [getSinglePolicy] = useGetSinglePolicyMutation();

  useEffect(() => {
    dispatch(setSelectedPolicy(NEW_POLICY_ITEM));
  }, [dispatch]);

  useEffect(() => {
    if (isPolicyDataSuccess) {
      const list = policyListResponse?.items.map((policy: any) => {
        return {
          id: policy.uuid,
          title: policy.policy_name,
          value: 'EXISTING',
        };
      });
      setPolicyList([NEW_POLICY_ITEM, ...list]);
    }
  }, [isPolicyDataSuccess, policyListResponse]);

  const handlePolicySelection = async (item: ISelectList) => {
    dispatch(setSelectedPolicy(item));
    if (item.value === 'NEW') {
      dispatch(prepareFormData({ data }));
    } else {
      await getSinglePolicy(item.id)
        .unwrap()
        .then((res: any) => {
          if (res) {
            dispatch(setPolicyData(res));
            dispatch(prepareFormData({ data, edit: true }));
          }
        });
    }
  };

  if (showPolicySelection) {
    return (
      <Box>
        <FormControl sx={{ mb: 1, width: 300 }}>
          <SelectList
            keyTitle="title"
            defaultValue={selectedPolicy}
            items={policyList}
            variant="filled"
            label={'Create new or choose existing policy'}
            placeholder="Select a value"
            type={'text'}
            disableClearable={true}
            onChangeItem={handlePolicySelection}
          />
        </FormControl>
      </Box>
    );
  } else return null;
}

export default PolicySelection;
