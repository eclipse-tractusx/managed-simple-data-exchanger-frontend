/********************************************************************************
 * Copyright (c) 2021,2024 T-Systems International GmbH
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

import { setPageLoading } from '../features/app/slice';
import { Config } from '../utils/config';

export const HOST = Config.REACT_APP_API_URL;

// Reusable loading state handler
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function setLoadingHandler(_: any, { dispatch, queryFulfilled }: any) {
  try {
    dispatch(setPageLoading(true));
    await queryFulfilled;
  } finally {
    dispatch(setPageLoading(false));
  }
}
