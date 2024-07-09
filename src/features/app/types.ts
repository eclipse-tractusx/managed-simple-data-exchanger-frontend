/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
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
import { IAlertColors } from '../notifiication/types';
export interface IUser {
  userName: string;
  name: string;
  email: string;
  company: string;
  bpn: string;
  tenant: string;
}
export interface IAppSlice {
  pageLoading: boolean;
  loggedInUser: IUser;
  permissions: string[];
  useCases: IUseCase[];
  selectedUseCases: string[];
  useCaseNames: string[];
  sidebarExpanded: boolean;
}
export interface IUseCase {
  id: string;
  title: string;
  checked?: boolean;
}
export interface IExtraOptions {
  showNotification?: boolean;
  message?: string;
  type?: IAlertColors;
}

export class UseCaseSelectionModel {
  static create(useCase: IUseCase[]) {
    return useCase.map(item => {
      return { id: item.id, title: item.title, checked: false };
    });
  }
}
