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

import { Refresh } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { LoadingButton, Typography } from 'cx-portal-shared-components';
import { t } from 'i18next';
interface IPageHeading {
  refetch?: () => void;
  isFetching?: boolean;
  title: string;
  description: string;
  showRefresh?: boolean;
}
function PageHeading({ refetch, isFetching, title, description, showRefresh = false }: IPageHeading) {
  return (
    <Grid container spacing={2} alignItems="center" mb={4}>
      <Grid item xs={9}>
        <Typography variant="h3" mb={1}>
          {t(title)}
        </Typography>
        <Typography variant="body1">{t(description)}</Typography>
      </Grid>
      <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
        {showRefresh && (
          <LoadingButton
            size="small"
            variant="contained"
            label={t('button.refresh')}
            onButtonClick={refetch}
            startIcon={<Refresh />}
            loadIndicator={t('content.common.loading')}
            loading={isFetching}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default PageHeading;
