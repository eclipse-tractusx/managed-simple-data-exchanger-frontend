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

import _ from 'lodash';

import { apiSlice } from '../../app/apiSlice';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHelpPageData: builder.query({
      query: params => {
        return {
          url: '/submodels/schema-details',
          params,
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]) => {
        const pageData = response.map(submodel => {
          return {
            name: submodel.title,
            description: submodel.description,
            id: submodel.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rows: Object.entries(submodel.items.properties).map(([key, value]: any, index) => ({
              id: index,
              name: key,
              mandatory: _.indexOf(submodel.items.required, key) > -1 ? 'true' : 'false',
              order: index + 1,
              description: value.description,
            })),
          };
        });
        return pageData;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setPageLoading(true));
        try {
          await queryFulfilled;
        } catch (err) {
          dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.somethingWrong' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetHelpPageDataQuery } = helpApiSlice;
