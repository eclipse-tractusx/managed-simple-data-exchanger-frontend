/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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

import { FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { Checkbox } from 'cx-portal-shared-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchUseCases } from '../features/app/actions';
import { IUseCase } from '../features/app/types';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function Home() {
  const { useCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
  };

  return (
    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">{t('content.home.selectUsecases')}</FormLabel>
      <FormGroup>
        {useCases.map((item: IUseCase) => (
          <FormControlLabel control={<Checkbox onChange={handleChange} name={item.title} />} label={item.title} />
        ))}
      </FormGroup>
    </FormControl>
  );
}
