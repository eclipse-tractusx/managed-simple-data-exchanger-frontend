/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2024 T-Systems International GmbH
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

import { Typography } from '@catena-x/portal-shared-components';
import { Grid } from '@mui/material';
import { isEmpty } from 'lodash';
import { Key } from 'react';

function UsagePolicies({ usagePolicies }: any) {
  return (
    <>
      {!isEmpty(usagePolicies) ? (
        usagePolicies.map((policy: any, index: Key) => (
          <Grid item xs={6} sx={{ mb: 1 }} key={policy.technicalKey + index}>
            <Typography variant="body2">
              <b>{policy.technicalKey} :</b> {policy.value[0]}
            </Typography>
          </Grid>
        ))
      ) : (
        <Typography variant="body2">Not Available</Typography>
      )}
    </>
  );
}

export default UsagePolicies;
