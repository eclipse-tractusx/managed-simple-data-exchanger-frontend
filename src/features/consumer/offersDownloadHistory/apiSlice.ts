/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
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

import { apiSlice } from '../../app/apiSlice';

export const offersDownloadHistoryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    offersDownloadHistory: builder.query({
      query: params => {
        return {
          url: '/consumer-download-history',
          params,
        };
      },
      // transformResponse: res => {
      //   console.log(res);
      //   return {
      //     pageNumber: 0,
      //     pageSize: 2147483647,
      //     totalItems: 44,
      //     items: [
      //       {
      //         processId: '752e51ce-c1c0-491a-bfe7-ed349c8ab597',
      //         providerUrl: 'https://tsyste-756329ac-de.int.cx.dih-cloud.com',
      //         connectorId: 'BPNL001000TS0100',
      //         numberOfItems: 4,
      //         numberOfFailedItems: 2,
      //         numberOfSucceededItems: 2,
      //         status: 'COMPLETED',
      //         startDate: '2023-09-06T12:01:46.348484',
      //         endDate: '2023-09-06T18:01:46.361371',
      //         offers: [
      //           {
      //             offerId:
      //               'YjJiZDZiYzQtYmExMC00OTliLThlNGQtMzQwMjllMWIxOWRk:dXJuOnV1aWQ6N2RmYjQwYjQtOWM1OC00YTExLTgwNTEtNzI5NTBkZjA1YjkxLXVybjp1dWlkOjk0OTUzYTVhLTE5OTgtNDI0ZC05MDI2LTA1YWNhMTQ2MzJkMw==:M2M5YzUxNGQtOWVmYy00ZmZlLTljNjMtYzdiZTBkZDVmZjA3',
      //             assetId:
      //               'urn:uuid:7dfb40b4-9c58-4a11-8051-72950df05b91-urn:uuid:94953a5a-1998-424d-9026-05aca14632d3',
      //             policyId: '',
      //             agreementId:
      //               'ZmI2OWEyY2QtZTMxOS00ZTdkLWI5OGQtNDZlNTRlYzQ4Mjk3:dXJuOnV1aWQ6OWZlMmUwNzYtYTAyNy00NTMxLWE5NDktNjJkNmVjNzNiMDhjLXVybjp1dWlkOmU2NDEyZjAzLTMxMTMtNDNjOS04ZjA5LTFlNDg0YzExNDA3Ng==:N2NjZmUzYWYtOWM2Mi00ZWJlLWFiYzAtZTliMzNkMzk0ZTMy',
      //             expirationDate: '1693920119000',
      //             transferProcessId: '022a7497-d3da-4121-bbaf-9bd525e960e6',
      //             status: 'SUCCESS/FAILED',
      //             downloadErrorMsg:
      //               'safdomething asdfomasdfsa asdf asdfsadfdsafdsafsad asdfsadfsadfdsa asdfsadf asdfasdfas asdfadsfsadf asfasf asdfasdfa asdfasfasdf',
      //           },
      //           {
      //             offerId:
      //               'YmU5YTIyNDAtNGYxMS00MjFiLTk3MTItZTVhYmNiZTFkNzcz:dXJuOnV1aWQ6MGRhOTFmMWQtMDY0NC00ZDdmLWI5ZjEtNTE0MjFiZGVhZTNkLXVybjp1dWlkOjE2ZTE4ZWRhLWRiMmQtNGVkYS1hYzBiLTc5NzBkM2U0NDI4Yw==:YjgyYmMyODgtNzI1OC00NTFiLWE3MDAtZDk2MTFjMTkxMzkw',
      //             assetId:
      //               'urn:uuid:0da91f1d-0644-4d7f-b9f1-51421bdeae3d-urn:uuid:16e18eda-db2d-4eda-ac0b-7970d3e4428c',
      //             policyId: '',
      //             agreementId:
      //               'ZmI2OWEyY2QtZTMxOS00ZTdkLWI5OGQtNDZlNTRlYzQ4Mjk3:dXJuOnV1aWQ6OWZlMmUwNzYtYTAyNy00NTMxLWE5NDktNjJkNmVjNzNiMDhjLXVybjp1dWlkOmU2NDEyZjAzLTMxMTMtNDNjOS04ZjA5LTFlNDg0YzExNDA3Ng==:N2NjZmUzYWYtOWM2Mi00ZWJlLWFiYzAtZTliMzNkMzk0ZTMy',
      //             expirationDate: '1693920119000',
      //             transferProcessId: '022a7497-d3da-4121-bbaf-9bd525e960e6',
      //             status: 'SUCCESS/FAILED',
      //             downloadErrorMsg:
      //               'safdomething asdfomasdfsa asdf asdfsadfdsafdsafsad asdfsadfsadfdsa asdfsadf asdfasdfas asdfadsfsadf asfasf asdfasdfa asdfasfasdf',
      //           },
      //           {
      //             offerId:
      //               'MTgwNzliYTYtYjZhNy00ZTJiLTg5NDctZmRlMWIxMzYyYWVl:dXJuOnV1aWQ6MWY4NGU3YTEtYzljYy00ZTU0LWFlNTUtZDE1MTRlN2IyOTU4LXVybjp1dWlkOjQ4NDU2YzRmLWVkMTItNGI5OS05YmZiLTM0MTYyMWM0YjhjYw==:YWYwNmI2M2ItNWI2NS00ZDgzLWEwZmEtYjdlN2U2ODFjMjM5',
      //             assetId:
      //               'urn:uuid:1f84e7a1-c9cc-4e54-ae55-d1514e7b2958-urn:uuid:48456c4f-ed12-4b99-9bfb-341621c4b8cc',
      //             policyId: '',
      //             agreementId:
      //               'ZmI2OWEyY2QtZTMxOS00ZTdkLWI5OGQtNDZlNTRlYzQ4Mjk3:dXJuOnV1aWQ6OWZlMmUwNzYtYTAyNy00NTMxLWE5NDktNjJkNmVjNzNiMDhjLXVybjp1dWlkOmU2NDEyZjAzLTMxMTMtNDNjOS04ZjA5LTFlNDg0YzExNDA3Ng==:N2NjZmUzYWYtOWM2Mi00ZWJlLWFiYzAtZTliMzNkMzk0ZTMy',
      //             expirationDate: '1693920119000',
      //             transferProcessId: '022a7497-d3da-4121-bbaf-9bd525e960e6',
      //             status: 'SUCCESS/FAILED',
      //             downloadErrorMsg:
      //               'safdomething asdfomasdfsa asdf asdfsadfdsafdsafsad asdfsadfsadfdsa asdfsadf asdfasdfas asdfadsfsadf asfasf asdfasdfa asdfasfasdf',
      //           },
      //           {
      //             offerId:
      //               '',
      //             assetId:
      //               'urn:uuid:2e467869-41a2-411a-8e9c-c0a6ed5a6ca0-urn:uuid:ab1d9f3a-18be-40fe-a6e7-835e19c1cc40',
      //             policyId: '',
      //             agreementId:
      //               'ZmI2OWEyY2QtZTMxOS00ZTdkLWI5OGQtNDZlNTRlYzQ4Mjk3:dXJuOnV1aWQ6OWZlMmUwNzYtYTAyNy00NTMxLWE5NDktNjJkNmVjNzNiMDhjLXVybjp1dWlkOmU2NDEyZjAzLTMxMTMtNDNjOS04ZjA5LTFlNDg0YzExNDA3Ng==:N2NjZmUzYWYtOWM2Mi00ZWJlLWFiYzAtZTliMzNkMzk0ZTMy',
      //             expirationDate: '1693920119000',
      //             transferProcessId: '022a7497-d3da-4121-bbaf-9bd525e960e6',
      //             status: 'SUCCESS/FAILED',
      //             downloadErrorMsg: '<Error message if download failed>',
      //           },
      //         ],
      //         policies: [],
      //         referenceProcessId: '<existing processId which refer redownload again>',
      //       },
      //     ],
      //   };
      // },
    }),
  }),
});

export const { useOffersDownloadHistoryQuery } = offersDownloadHistoryApiSlice;
