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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { schemaValidator } from '../../helpers/SchemaValidator';
import ProviderService from '../../services/ProviderService';
import { setPageLoading } from '../app/slice';
import { setSnackbarMessage } from '../notifiication/slice';

const fetchSubmodelList = createAsyncThunk(`/submodel/list`, async () => {
  try {
    const res = await ProviderService.getInstance().getSubmodelList();
    return res;
  } catch (error) {
    console.log('api call error:', error);
  }
});
const fetchSubmodelDetails = createAsyncThunk(`/submodel/details`, async (params: string, { dispatch }) => {
  try {
    dispatch(setPageLoading(true));
    const res = await ProviderService.getInstance().getSubmodelDetails(params);
    return res;
  } catch (error) {
    console.log('api call error:', error);
  } finally {
    dispatch(setPageLoading(false));
  }
});
const submitJsonData = createAsyncThunk('/submit/json-data', async (data: string, { dispatch }) => {
  try {
    const json = JSON.parse(data.trim());
    if (json) {
      schemaValidator(json);
    }
  } catch (e) {
    dispatch(
      setSnackbarMessage({
        message: 'Invalid data! Enter Required * fields.',
        type: 'error',
      }),
    );
  }
});
export { fetchSubmodelList, fetchSubmodelDetails, submitJsonData };
