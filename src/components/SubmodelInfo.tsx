/*********************************************************************************
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
import '../styles/submodelDetails.scss';

import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material';
import { Tooltips, Typography } from 'cx-portal-shared-components';
import { Trans } from 'react-i18next';

import { useAppSelector } from '../features/store';

export default function SubmodelInfo() {
  const { previewTableHeadings, previewTableData, previewTableDescriptions, selectedSubmodel } = useAppSelector(
    state => state.submodelSlice,
  );

  return (
    <>
      <Typography variant="body1" fontWeight={'bold'} mb={2}>
        <Trans i18nKey={'content.provider.previewTableTitle'} values={{ submodel: selectedSubmodel.title }} />
      </Typography>
      <Box overflow={'scroll'} mb={3}>
        <table className="submodel-detail-table">
          <tbody>
            <tr>
              {previewTableHeadings.map((title: string, index: number) => (
                <th key={index}>{title}</th>
              ))}
            </tr>
            {previewTableData.map((data: string[], i: number) => (
              <tr key={i}>
                {data.map((e: string, index: number) => (
                  <td key={index}>{e}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Description</td>
              {previewTableDescriptions.map((desc: string, index: number) => (
                <td key={index}>
                  <Tooltips tooltipPlacement="top" tooltipText={desc}>
                    <span>
                      <InfoIcon color="primary" />
                    </span>
                  </Tooltips>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Box>
    </>
  );
}
