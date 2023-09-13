/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
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

import moment from 'moment';

import { apiSlice } from '../app/apiSlice';
import { setPageLoading } from '../app/slice';
import { IConsumerDataOffers } from './types';

export const consumerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchDataOffers: builder.mutation<IConsumerDataOffers[], unknown>({
      query: params => {
        return { method: 'GET', url: '/query-data-offers', params };
      },
      transformResponse(payload: IConsumerDataOffers[]) {
        const modifiedData = payload
          .sort(
            (contract1: IConsumerDataOffers, contract2: IConsumerDataOffers) =>
              moment(contract1.created, 'DD/MM/YYYY HH:mm:ss').unix() -
              moment(contract2.created, 'DD/MM/YYYY HH:mm:ss').unix(),
          )
          .map((item: IConsumerDataOffers, index: number) => {
            return { ...item, ...{ id: index } };
          });
        return modifiedData;
      },
    }),
    subscribeAndDownload: builder.mutation({
      query: body => {
        return {
          url: '/subscribe-download-data-offers',
          method: 'POST',
          body,
          responseHandler: res => res.blob(),
        };
      },
      extraOptions: { showNotification: true, message: 'alerts.subscriptionSuccess', type: 'success' },
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

export const { useSubscribeAndDownloadMutation, useFetchDataOffersMutation } = consumerApiSlice;
