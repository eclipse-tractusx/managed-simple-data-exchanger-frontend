/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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
import { IContractAgreements } from '../../consumer/types';

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getContracts: builder.query({
      query: ({ type, params }) => {
        return {
          url: `/contract-agreements/${type}`,
          params,
        };
      },
      providesTags: ['DeleteContract'],
      transformResponse: async ({ connector, contracts }) => {
        const modifieldData = contracts
          .sort(
            (contract1: IContractAgreements, contract2: IContractAgreements) =>
              contract2.dateCreated - contract1.dateCreated,
          )
          .map((item: IContractAgreements, index: number) => {
            return { ...{ id: index, ...item } };
          });
        return { connector, contracts: modifieldData };
      },
    }),
    deleteContract: builder.mutation({
      query: ({ negotiationId, type }) => ({
        url: `contract-agreements/${negotiationId}/${type}/decline`,
        method: 'POST',
      }),
      extraOptions: { showNotification: true, message: 'alerts.contractDeclined', type: 'error' },
      invalidatesTags: ['DeleteContract'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          await queryFulfilled;
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetContractsQuery, useDeleteContractMutation } = contractsSlice;
