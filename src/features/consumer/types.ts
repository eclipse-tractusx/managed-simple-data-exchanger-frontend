/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface IUsageControl {
  typeOfAccess: string;
  value?: string;
  durationUnit?: string | Record<string, never>;
}

export interface IId {
  '@id': string;
}

export interface IConstraint {
  'odrl:leftOperand': IId;
  'odrl:operator': IId;
  'odrl:rightOperand': string;
}

export interface IConstraintOrContainer {
  'odrl:or'?: IConstraint | IConstraint[];
}
export interface IConstraintAndContainer {
  'odrl:and'?: IConstraint | IConstraint[];
}

export interface IPermission {
  'odrl:action': IId;
  'odrl:constraint'?: IConstraintOrContainer | IConstraintAndContainer;
}

export interface IHasPolicy {
  '@id': string;
  '@type': string;
  'odrl:permission': IPermission | IPermission[];
  'odrl:prohibition': any;
  'odrl:obligation': any;
}

export interface IConsumerDataOffers {
  id?: number;
  // connectorOfferid same assetId
  connectorOfferid?: string;
  assetId?: string;
  // end assetId
  connectorId?: string;
  connectorOfferUrl?: string;
  title: string;
  version: string;
  description: string;
  created: string;
  modified: string;
  publisher: string;
  offerInfo?: string;
  policyId?: string;
  typeOfAccess: string;
  bpnNumbers: string[];
  // contractInfo and offerID same
  contractInfo?: string;
  offerId?: string;
  // end offerId
  policy?: any;
  hasPolicy?: IHasPolicy;
  usagePolicies: IUsageControl[];
  fileName?: string;
  fileContentType?: string;
  sematicVersion: string;
}

export interface ILegalEntityName {
  value?: string;
  shortname?: string | null;
  type?: unknown;
  language?: unknown;
}

export interface ILegalEntityDetails {
  bpn?: string;
  identifiers?: unknown[];
  names?: ILegalEntityName[];
  legalForm?: unknown;
  status?: unknown;
}

export interface ILegalEntityContent {
  score?: number;
  legalEntity?: ILegalEntityDetails;
  name?: string;
  bpn?: string;
}

export interface ILegalEntity {
  totalElements?: number;
  totalPages?: number;
  page?: number;
  contentSize?: number;
  content?: ILegalEntityContent[];
}

export interface IntOption {
  _id: number | string;
  bpn: string;
  value: string;
}

export interface IConnectorResponse {
  bpn: string;
  connectorEndpoint: string[];
}

export interface IContractAgreementInfo {
  contractSigningDate: number;
  contractStartDate: number;
  contractEndDate: number;
  assetId: string;
  policies: IUsageControl[];
}

export interface IContractAgreements {
  negotiationId: string;
  counterPartyAddress: string;
  state: string;
  title: string;
  organizationName: string;
  contractAgreementId?: string;
  contractAgreementInfo?: IContractAgreementInfo;
  dateCreated: number;
  dateUpdated: number;
}

interface Option {
  [key: string]: any;
}

export interface IntConnectorItem extends Option{
  id: number;
  value: string;
  title: string;
}

export interface IConsumerSlice {
  offersLoading: boolean;
  contractOffers: IConsumerDataOffers[];
  selectedOffersList: IConsumerDataOffers[];
  selectedOffer: IConsumerDataOffers;
  isMultipleContractSubscription: boolean;
  searchFilterByType: Partial<IntConnectorItem>;
  filterProviderUrl: string;
  filterCompanyOptions: IntOption[];
  filterCompanyOptionsLoading: boolean;
  filterSelectedCompanyOption: IntOption | null;
  filterSelectedBPN: string | null;
  filterConnectors: IntConnectorItem[];
  filterSelectedConnector: Partial<IntConnectorItem>;
  contractAgreements: IContractAgreements[];
  isContractAgreementsLoading: boolean;
  openOfferDetailsDialog: boolean;
  openOfferConfirmDialog: boolean;
}
