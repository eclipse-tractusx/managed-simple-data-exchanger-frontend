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

import '../styles/home.scss';

import { Button, Checkbox, Tab, TabPanel, Tabs, Typography } from '@catena-x/portal-shared-components';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, Box, FormControlLabel, Grid } from '@mui/material';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataExchangeStepper } from '../components/DataExchangeStepper';
import { setUseCases } from '../features/app/slice';
import { IUseCase } from '../features/app/types';
import { clearRows, setSelectedSubmodel } from '../features/provider/submodels/slice';
import { ISubmodelList } from '../features/provider/submodels/types';
import { removeSelectedFiles, setUploadStatus } from '../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { consumeDataSteps, provideDataSteps } from '../models/Home';
import { USER_GUIDE_URL } from '../utils/constants';
import { openInNewTab } from '../utils/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const { loggedInUser, useCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleUseCaseChange = useCallback(
    (usecase: IUseCase) => {
      // Clearing all the ongoing uploads
      dispatch(setSelectedSubmodel({} as ISubmodelList));
      dispatch(setUploadStatus(true));
      dispatch(clearRows());
      dispatch(removeSelectedFiles());

      const res = useCases.map(item => (item.id === usecase.id ? { ...item, checked: !item.checked } : item));
      dispatch(setUseCases(res));
    },
    [dispatch, useCases],
  );

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h3">{t('content.home.header')}</Typography>
        <Typography variant="body1" my={2}>
          {loggedInUser.company}
        </Typography>
        <Typography variant="h4" mb={1}>
          {t('content.common.introduction')}
        </Typography>
        <Box>
          <Typography>{t('content.home.sdeDescription')}</Typography>
          <Button
            variant="text"
            size="medium"
            onClick={() => openInNewTab(USER_GUIDE_URL)}
            endIcon={<ArrowForwardIcon />}
            sx={{
              p: 0,
              mt: 2,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {t('content.home.accessDescription')}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <img src="images/sde.png" width={'100%'} alt="sde" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" mt={3} mb={1}>
          {t('content.home.selectUsecasesHeader')} (optional)
        </Typography>
        <Typography variant="body1" maxWidth={1000}>
          {t('content.home.selectUsecasesSubheader')}
        </Typography>
        {useCases && (
          <Grid container spacing={3} mt={0}>
            {useCases.map((item: IUseCase) => (
              <Grid item key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.checked}
                      onChange={() => handleUseCaseChange(item)}
                      sx={{ '&.MuiCheckbox-root': { display: 'none' } }}
                    />
                  }
                  label={
                    <Box className="usecase-tile-content">
                      {item.checked && (
                        <CheckCircleIcon color="primary" sx={{ position: 'absolute', top: 15, right: 15 }} />
                      )}
                      <Avatar src={`images/${item.id}.png`} sx={{ width: 60, height: 60 }} />
                      <Typography variant="subtitle1">{item.title}</Typography>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} my={5}>
        <Typography variant="h4" mb={1}>
          {t('content.home.exchangeDataHeader')}
        </Typography>
        <Typography variant="body1" maxWidth={1000}>
          {t('content.home.exchangeDataDescription')}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mt={4} className="exchange-data-wrapper">
          <Tabs
            value={activeTab}
            onChange={(_event: SyntheticEvent, newValue: number) => handleTabChange(_event, newValue)}
            aria-label="Connector views: tabs"
            sx={{ pt: 0 }}
          >
            <Tab label={t('content.home.provideDataTab')} />
            <Tab label={t('content.home.consumeDataTab')} />
          </Tabs>
        </Box>
        <Box>
          <TabPanel value={activeTab} index={0}>
            <DataExchangeStepper data={provideDataSteps} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <DataExchangeStepper data={consumeDataSteps} />
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
}
