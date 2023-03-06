/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from '../../services/RequestService';
import { setSnackbarMessage } from '../notifiication/slice';

const baseQuery = fetchBaseQuery(apiBaseQuery());
const baseQueryInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const { error, data } = await baseQuery(args, api, extraOptions);
  if (error) {
    api.dispatch( setSnackbarMessage({
      message: (data as any)?.msg ? (data as any)?.msg : 'alerts.somethingWrong',
      type: 'error',
    }));
  }
  return { data };
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  tagTypes: ['UploadHistory'],
});
