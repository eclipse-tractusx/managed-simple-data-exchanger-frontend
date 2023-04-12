/********************************************************************************
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

import '../styles/home.scss';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Avatar, Box, FormControl, Grid, Stack } from '@mui/material';
import { Button, Tab, TabPanel, Tabs, Typography } from 'cx-portal-shared-components';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataExchangeStepper } from '../components/DataExchangeStepper';
import { fetchUseCases } from '../features/app/actions';
import { setSelectedUseCases } from '../features/app/slice';
import { IUseCase } from '../features/app/types';
import { clearRows, setSelectedSubmodel } from '../features/provider/submodels/slice';
import { ISubmodelList } from '../features/provider/submodels/types';
import { removeSelectedFiles, setUploadStatus } from '../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { consumeDataSteps, provideDataSteps } from '../models/Home';

const userGuideUrl = 'https://github.com/catenax-ng/tx-dft-frontend/tree/main/docs/user-guide';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const { loggedInUser, useCases, selectedUseCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const handleUseCaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Clearing all the ongoing uploads
    dispatch(setSelectedSubmodel({} as ISubmodelList));
    dispatch(setUploadStatus(true));
    dispatch(clearRows());
    dispatch(removeSelectedFiles());

    const { value, checked } = event.target;
    if (checked) {
      dispatch(setSelectedUseCases([...selectedUseCases, value]));
    } else {
      dispatch(setSelectedUseCases(selectedUseCases.filter((e: string) => e !== value)));
    }
  };

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ flex: 1, p: 4 }}>
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
              onClick={() => openInNewTab(userGuideUrl)}
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
            <img src="images/sde.png" width={'100%'} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" mt={3} mb={1}>
            {t('content.home.selectUsecasesHeader')} (optional)
          </Typography>
          <Typography variant="body1" maxWidth={1000}>
            {t('content.home.selectUsecasesSubheader')}
          </Typography>
          <FormControl component="fieldset" variant="standard">
            <Stack direction="row" spacing={1} mt={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {useCases.map((item: IUseCase) => (
                <Box className="usecase-tile" key={item.id}>
                  <input
                    type="checkbox"
                    name={item.title}
                    value={item.id}
                    id={item.id}
                    onChange={handleUseCaseChange}
                    checked={selectedUseCases.includes(item.id)}
                  />
                  <label className="usecase-tile-content" htmlFor={item.id}>
                    <Stack className="usecase-tile-content-wrapper" spacing={2}>
                      <Avatar src={`images/${item.id}.png`} sx={{ width: 60, height: 60 }} />
                      <Typography variant="subtitle1">{item.title}</Typography>
                    </Stack>
                  </label>
                </Box>
              ))}
            </Stack>
          </FormControl>
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
    </Box>
  );
}
