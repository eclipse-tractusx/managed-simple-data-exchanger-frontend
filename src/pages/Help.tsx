/* eslint-disable @typescript-eslint/no-explicit-any */
/*********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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

import { Box, Card, CardContent, Grid } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { SubmodelHelp } from '../components/SubmodelHelp';
import { rulesContentStyle, submodelHelpArr } from '../utils/helpUtils';

export const Help = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Typography variant="h4" mb={4}>
        {t('pages.help')}
      </Typography>
      <Grid container spacing={2}>
        {submodelHelpArr.map((submodel: any, key: number) => (
          <Grid key={key} item xs={6}>
            <SubmodelHelp
              submodelName={submodel.name}
              rows={submodel.rows}
              onCopyHeaders={submodel.onCopyHeader}
              downloadUrl={submodel.downloadUrl}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5">{t('content.common.rules')}</Typography>
              <ul style={rulesContentStyle}>
                <li> {t('content.help.rules1')}</li>
                <li> {t('content.help.rules2')}</li>
                <li> {t('content.help.rules3')}</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Help;
