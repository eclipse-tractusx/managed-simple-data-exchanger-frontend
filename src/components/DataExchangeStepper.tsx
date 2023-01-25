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

import { Box, Divider, Grid } from '@mui/material';
import { Button, Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IDataSteps } from '../models/Home';

interface IDataExchangeStepper {
  data: IDataSteps[];
}

export const DataExchangeStepper: React.FC<IDataExchangeStepper> = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={2} alignItems="center">
          {data.map(step => {
            const StepIcon = step?.stepLink?.icon;
            return (
              <Grid item xs="auto" key={step.stepNum}>
                <Box
                  p={2}
                  sx={{
                    width: 200,
                    height: 160,
                  }}
                >
                  <Typography variant="h5">{step.stepNum}</Typography>
                  <Divider sx={{ background: '#0F71CB' }} />
                  <Typography variant="subtitle1" mt={2}>
                    {t(step.stepTitle)}
                  </Typography>
                  {step?.stepLink && (
                    <Button
                      variant="text"
                      size="medium"
                      onClick={() => navigate(step.stepLink.routeUrl)}
                      startIcon={<StepIcon />}
                      sx={{
                        p: 0,
                        mt: 2,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t(step.stepLink.text)}
                    </Button>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};
