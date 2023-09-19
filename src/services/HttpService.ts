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

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { setSnackbarMessage } from '../features/notifiication/slice';
import { store } from '../features/store';
import { HOST } from '../helpers/ApiHelper';
import UserService from './UserService';

abstract class HttpService {
  protected readonly instance: AxiosInstance;

  public constructor(requestConfig: AxiosRequestConfig) {
    this.instance = axios.create(requestConfig);
    this.instance.interceptors.request.use(request => {
      request.baseURL = HOST;
      request.headers.Authorization = `Bearer ${UserService.getToken()}`;
      return request;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        // in order to get the error message from blob type response, it should be parsed
        const errorMessage = JSON.parse(await error.response.data.text()).msg;
        // Need to remove this store usage to avoid circlular dependecy issues
        store.dispatch(
          setSnackbarMessage({
            message: errorMessage || 'alerts.somethingWrong',
            type: 'error',
          }),
        );
        return Promise.reject(error.response);
      },
    );
  }
}

export default HttpService;
