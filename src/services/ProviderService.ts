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
import HttpService from './HttpService';
class ProviderService extends HttpService {
  constructor() {
    super({});
  }

  private static classInstance?: ProviderService;

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new ProviderService();
    }
    return this.classInstance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getSubmodelList(params?: any) {
    const usecaseParam = params.length ? `?usecases=${params}` : '';
    const res = await this.instance({
      method: 'GET',
      url: `/submodels${usecaseParam}`,
    });
    return res?.data;
  }

  public async getSubmodelDetails(submodel: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/submodels/${submodel}`,
    });
    return res?.data;
  }

  public async getReportById(id: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/processing-report/${id}`,
    });
    return res;
  }

  public async getUploadHistory(params: unknown) {
    const res = await this.instance({
      method: 'GET',
      url: '/processing-report',
      params,
    });
    return res;
  }

  public async uploadData(url: string, data: FormData) {
    const res = await this.instance({
      method: 'POST',
      url: `${url}/upload`,
      data,
    });
    return res;
  }

  public async submitSubmodalData(url: string, data: unknown) {
    const res = await this.instance({
      method: 'POST',
      url: `${url}/manualentry`,
      data,
    });
    return res;
  }

  public async deleteSubmodal(processId: string, csvType: string) {
    const res = await this.instance({
      method: 'DELETE',
      url: `${csvType}/delete/${processId}`,
    });
    return res;
  }

  public async getAllSchemas() {
    const res = await this.instance({
      method: 'GET',
      url: '/submodels/schema-details',
    });
    return res?.data;
  }

  public async getUplodHistoryErrors(processId: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/processing-report/failure-details/${processId}`,
    });
    return res;
  }
}

export default ProviderService;
