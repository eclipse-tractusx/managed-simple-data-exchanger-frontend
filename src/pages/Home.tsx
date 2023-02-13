/********************************************************************************
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

import './Home.scss';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Avatar, Box, FormControl, Grid, Stack } from '@mui/material';
import { Button, Tab, TabPanel, Tabs, Typography } from 'cx-portal-shared-components';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataExchangeStepper } from '../components/DataExchangeStepper';
import { fetchUseCases } from '../features/app/actions';
import { setSelectedUseCases } from '../features/app/slice';
import { IUseCase } from '../features/app/types';
import { clearRows, setSelectedSubmodel } from '../features/submodels/slice';
import { ISubmodelList } from '../features/submodels/types';
import { consumeDataSteps, provideDataSteps } from '../models/Home';
import { removeSelectedFiles, setUploadStatus } from '../store/providerSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

const userGuideUrl = 'https://github.com/catenax-ng/tx-dft-frontend/tree/main/documentation/user-guide';

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
      dispatch(setSelectedUseCases(selectedUseCases.filter(e => e !== value)));
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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h3">{t('content.home.header')}</Typography>
          <Typography variant="subtitle1" mt={2}>
            {loggedInUser.company}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">{t('content.home.selectUsecasesHeader')}</Typography>
          <Typography variant="subtitle2" maxWidth={900}>
            {t('content.home.selectUsecasesSubheader')}
          </Typography>
          <FormControl component="fieldset" variant="standard">
            <Stack direction="row" spacing={1} mt={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {useCases.map((item: IUseCase) => (
                <div className="usecase-tile" key={item.id}>
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
                </div>
              ))}
            </Stack>
          </FormControl>
        </Grid>
        <Grid item xs={12} mt={5}>
          <Typography variant="h4">{t('content.home.exchangeDataHeader')}</Typography>
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
        <Grid item xs={12} mt={5}>
          <Box mt={4} className="video-wrapper">
            <img src="images/sde.png" width={700} />
            <img src="images/play.png" className="playIcon" />
          </Box>
        </Grid>
        <Grid item xs={5} pt={0}>
          <article>
            <p style={{ margin: 0 }}>{t('content.home.sdeDescription')}</p>
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
              {t('content.home.learnSde')}
            </Button>
          </article>
        </Grid>
      </Grid>
    </Box>
  );
}
