/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

import { Box, Grid } from '@mui/material';
import { Tab, TabPanel, Tabs, Typography } from 'cx-portal-shared-components';
import _ from 'lodash';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DataTable from '../components/DataTable';
import DownloadCSV from '../components/DownloadCSV';
import PoliciesDialog from '../components/policies/PoliciesDialog';
import SelectSubmodel from '../components/SelectSubmodel';
import SubmodelInfo from '../components/SubmodelInfo';
import UploadFile from '../components/UploadFile';
import { useAppSelector } from '../features/store';

export default function CreateData() {
  const [activeTab, setActiveTab] = useState(0);
  const { selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const { t } = useTranslation();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Typography variant="h3" mb={2}>
        {t('pages.createData')}
      </Typography>
      <Typography variant="body1">{t('content.provider.description_1')}</Typography>
      <Typography variant="body1">{t('content.provider.description_2')}</Typography>
      <ul style={{ margin: 0 }}>
        <li>
          <Typography variant="body1">{t('content.provider.description_2_1')}</Typography>
        </li>
        <li>
          <Typography variant="body1">{t('content.provider.description_2_2')}</Typography>
        </li>
      </ul>
      <Grid container spacing={2} mb={3} display={'flex'} alignItems={'flex-end'}>
        <Grid item xs={3}>
          <SelectSubmodel />
        </Grid>
        {!_.isEmpty(selectedSubmodel) ? (
          <Grid item xs={6}>
            <DownloadCSV submodel={selectedSubmodel.value} />
          </Grid>
        ) : null}
      </Grid>
      {!_.isEmpty(selectedSubmodel) ? (
        <Box>
          <SubmodelInfo />
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleChange} aria-label="upload types: tabs" sx={{ pt: 0 }}>
              <Tab label={t('content.provider.uploadFile')} />
              <Tab label={t('content.provider.table')} />
            </Tabs>
          </Box>
          <Box>
            <TabPanel value={activeTab} index={0}>
              <UploadFile />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <DataTable />
            </TabPanel>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <Typography variant="body1">{t('content.provider.selectSubmodel')}</Typography>
        </Box>
      )}
      <PoliciesDialog />
    </Box>
  );
}
