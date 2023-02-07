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
import { apiSlice } from '../../app/apiSlice';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getContracts: builder.query({
      query: params => {
        return {
          url: '/contract-agreements',
          params,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        dispatch(setPageLoading(true));
        try {
          await queryFulfilled;
          // `onSuccess` side-effect
        } catch (err) {
          // `onError` side-effect
          dispatch(setSnackbarMessage({ type: 'error', message: 'Something went wrong!' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetContractsQuery } = contractsSlice;
