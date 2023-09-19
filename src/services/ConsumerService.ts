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
class ConsumerService extends HttpService {
  public constructor() {
    super({});
  }

  private static classInstance?: ConsumerService;

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new ConsumerService();
    }
    return this.classInstance;
  }

  public async fetchConsumerDataOffers(params: unknown) {
    const res = await this.instance({
      method: 'GET',
      url: '/query-data-offers',
      params,
    });
    return res;
  }

  public async subscribeToOffers(offers: unknown) {
    const res = await this.instance({
      method: 'POST',
      url: '/subscribe-download-data-offers',
      data: offers,
      responseType: 'blob',
    });
    return res;
  }

  public async downloadDataOffers(params: unknown) {
    const res = await this.instance({
      method: 'GET',
      url: '/download-data-offers',
      params,
      responseType: 'blob',
    });
    return res;
  }

  // Get company name by free text
  public async searchLegalEntities(searchStr: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/legal-entities?searchText=${searchStr}&page=0&size=40`,
    });
    return res.data;
  }

  // Get connectors by bpn number
  public async searchConnectoByBPN(payload: string[]) {
    const res = await this.instance({
      method: 'POST',
      url: '/connectors-discovery',
      data: payload,
    });
    return res.data;
  }
}

export default ConsumerService;
