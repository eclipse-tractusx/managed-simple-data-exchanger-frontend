/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
 * Copyright (c) 2025 ARENA2036 e.V.
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getHelpPageData: builder.query({
      query: params => {
        return {
          url: '/submodels/schema-details',
          params,
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]) => {
        if (!Array.isArray(response)) return [];

        return response.map(submodel => {
          const properties = submodel?.items?.properties ?? {};
          const required = submodel?.items?.required ?? [];

          return {
            name: `${submodel.title} - ${submodel.version}`,
            description: submodel.description,
            id: submodel.id,
            rows: Object.entries(properties).map(([key, value]: any, index) => ({
              id: index,
              name: key,
              mandatory: required.includes(key) ? "true" : "false",
              order: index + 1,
              description: value?.description ?? "",
            })),
          };
        });
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setPageLoading(true));

        try {
          await queryFulfilled;
        } catch (err) {
          console.error("getHelpPageData error:", err);
          return;
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetHelpPageDataQuery } = helpApiSlice;
