/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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
import { SelectList } from 'cx-portal-shared-components';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchSubmodelDetails, fetchSubmodelList } from '../features/submodels/actions';
import { setSelectedSubmodel } from '../features/submodels/slice';
import { ISubmodelList } from '../features/submodels/types';
import { useAppDispatch, useAppSelector } from '../store/store';

const SelectSubmodel = () => {
  const { submodelList, selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const { selectedUseCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleTypeChange = useCallback(
    async (item: ISubmodelList) => {
      dispatch(setSelectedSubmodel(item));
      dispatch(fetchSubmodelDetails(item.value));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchSubmodelList(selectedUseCases));
  }, [dispatch, selectedUseCases]);

  return (
    <SelectList
      keyTitle="title"
      label={t('content.provider.selectSubmodel')}
      fullWidth
      size="small"
      defaultValue={selectedSubmodel}
      onChangeItem={e => handleTypeChange(e)}
      items={submodelList}
      placeholder={t('content.provider.selectSubmodel')}
      disableClearable={true}
    />
  );
};

export default SelectSubmodel;
