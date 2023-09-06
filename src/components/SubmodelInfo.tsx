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
import { Tooltips } from 'cx-portal-shared-components';
import { v4 as uuidv4 } from 'uuid';

import { useAppSelector } from '../features/store';

export default function SubmodelInfo() {
  const { previewTableHeadings, previewTableData, previewTableDescriptions } = useAppSelector(
    state => state.submodelSlice,
  );

  return (
    <>
      <Box overflow={'scroll'} mb={3} sx={{ background: 'white' }}>
        <table className="submodel-detail-table">
          <tbody>
            <tr>
              {previewTableHeadings.map((title: string) => (
                <th key={uuidv4()}>{title}</th>
              ))}
            </tr>
            {previewTableData.map((data: string[]) => (
              <tr key={uuidv4()}>
                {data.map((e: string) => (
                  <td key={uuidv4()}>{e}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Description</td>
              {previewTableDescriptions.map((desc: string) => (
                <td key={uuidv4()}>
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
