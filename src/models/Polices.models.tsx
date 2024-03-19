/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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

import { capitalize, find, isArray, isEmpty, isObject, keys, mapValues, merge, pickBy } from 'lodash';

import { PolicyHubResponse } from '../features/provider/policies/types';

export class PolicyHubModel {
  static convert(jsonData: PolicyHubResponse[]) {
    const fullPolicyData: any = {};
    jsonData.forEach(obj => {
      obj.type.forEach(type => {
        if (!fullPolicyData[type]) {
          fullPolicyData[type] = [];
        }
        fullPolicyData[type].push({
          ...obj,
          value: '',
          attribute: obj.attribute.map((el: any, index: number) => {
            return { index, ...el };
          }),
        });
      });
    });
    return { ...fullPolicyData, policy_name: '' };
  }

  static usecaseFilter(jsonData: PolicyHubResponse[], selectedUseCases?: string[]) {
    let filteredData = jsonData;
    if (!isEmpty(selectedUseCases)) {
      filteredData = jsonData.filter(obj =>
        selectedUseCases.some(useCase => obj.useCase.includes(capitalize(useCase))),
      );
    }
    return PolicyHubModel.convert(filteredData);
  }

  static preparePayload(formData: any) {
    return mapValues(formData, policyType => {
      if (isArray(policyType)) {
        return policyType.map((policy: any) => ({
          technicalKey: policy.technicalKey,
          value: [isObject(policy.value) ? policy.value.value : policy.value],
        }));
      } else {
        return policyType;
      }
    });
  }

  static prepareEditData(targetObject: any, baseData: any) {
    const sourceObject = PolicyHubModel.convert(baseData);
    const targetClone = { ...targetObject };

    const handleFieldValues = (policies: any[]) => {
      return policies.map((policy: PolicyHubResponse) => ({
        ...policy,
        value: find(policy.attribute, { value: policy.value[0] }) || policy.value[0],
        // for future multiselect approach
        // value: filter(policy.attribute, item => includes(policy.value, item.value)) || policy.value[0],
      }));
    };

    const fieldNames = keys(pickBy(targetClone, isArray));

    fieldNames.map(fieldName => {
      // Assuming technicalKey is the common field in all policies
      const technicalKeyField = 'technicalKey';
      const policySet = new Set(targetClone[fieldName].map((policy: PolicyHubResponse) => policy[technicalKeyField]));
      const filteredPolicies: PolicyHubResponse[] = sourceObject[fieldName].filter((policy: PolicyHubResponse) =>
        policySet.has(policy[technicalKeyField]),
      );
      const mergedPolicies = merge(filteredPolicies, targetClone[fieldName]);
      targetClone[fieldName] = handleFieldValues(mergedPolicies);
    });
    return targetClone;
  }
}
