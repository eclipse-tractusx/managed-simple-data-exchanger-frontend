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

import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import OfferDetailsDialog from '../components/dialogs/OfferDetailsDialog';
import { IConsumerDataOffers } from '../features/consumer/types';

test('Snapshot OfferDetailsDialog - load and diaplay offer details component', () => {
  const offerItem: IConsumerDataOffers = {
    bpnNumbers: ['BPN1', 'BPN2'],
    connectorOfferid: 'connector1',
    connectorOfferUrl: 'http://localhost:8080',
    title: 'Offer title',
    created: '22/07/2022',
    description: 'description',
    publisher: 'name',
    version: '1.0.0',
    contractInfo: 'contract info dummy',
    modified: '22/07/2022',
    offerInfo: 'offer extra info',
    typeOfAccess: 'restricted',
    sematicVersion: 'urn:bamm:io.catenax.serial_part:1.0.0#SerialPart',
    usagePolicies: [
      {
        typeOfAccess: 'Unrestricted',
        value: '1',
      },
    ],
  };
  render(<OfferDetailsDialog />);
  const text = screen.getByText('Offer Details');
  const titleText = screen.getByText(offerItem.title);
  expect(text).toBeInTheDocument();
  expect(titleText).toBeInTheDocument();
});
