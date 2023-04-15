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
import InfoIcon from '@mui/icons-material/Info';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Box, SxProps } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export default function InfoSteps({ steps, icon, sx }: { steps: string[]; icon: string; sx?: SxProps }) {
  const { t } = useTranslation();
  const ICON_MAPPING: { [key: string]: ReactElement } = {
    tips: <TipsAndUpdatesIcon color="disabled" />,
    info: <InfoIcon color="disabled" />,
  };
  return (
    <Box display={'flex'} alignItems={'center'} sx={sx}>
      <Box mr={2}>{ICON_MAPPING[icon]}</Box>
      <Box>
        {steps?.map((step: string) => (
          <Typography variant="body2" key={step}>
            {t(step)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
