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
import { SelectList } from 'cx-portal-shared-components';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchSubmodelDetails, fetchSubmodelList } from '../features/provider/submodels/actions';
import { clearRows, setSelectedSubmodel } from '../features/provider/submodels/slice';
import { ISubmodelList } from '../features/provider/submodels/types';
import { removeSelectedFiles } from '../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../features/store';

const SelectSubmodel = () => {
  const { submodelList, selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const { selectedUseCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleTypeChange = useCallback(
    async (item: ISubmodelList) => {
      dispatch(setSelectedSubmodel(item));
      dispatch(fetchSubmodelDetails(item.value));
      // clearing the selected files and rows
      dispatch(clearRows());
      dispatch(removeSelectedFiles());
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
      defaultValue={selectedSubmodel}
      onChangeItem={e => handleTypeChange(e)}
      items={submodelList}
      placeholder={t('content.provider.selectSubmodel')}
      disableClearable={true}
    />
  );
};

export default SelectSubmodel;
