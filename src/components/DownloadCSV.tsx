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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Stack } from '@mui/material';
import { LoadingButton } from 'cx-portal-shared-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setSnackbarMessage } from '../features/notifiication/slice';
import { useAppDispatch } from '../features/store';
import AppService from '../services/appService';

export default function DownloadCSV({ submodel }: { submodel: string }) {
  const [downloadingSample, setdownloadingSample] = useState(false);
  const [downloadingTemplate, setdownloadingTemplate] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  async function download(type: string) {
    try {
      if (type === 'sample') {
        setdownloadingSample(true);
      } else {
        setdownloadingTemplate(true);
      }
      const { data } = await AppService.getInstance().downloadCSV(submodel, type);
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}-${submodel}.csv`);
        document.body.appendChild(link);
        link.click();
        dispatch(
          setSnackbarMessage({
            message: 'alerts.downloadSuccess',
            type: 'success',
          }),
        );
      }
    } catch (error) {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.downloadError',
          type: 'error',
        }),
      );
    } finally {
      setdownloadingSample(false);
      setdownloadingTemplate(false);
    }
  }

  return (
    <Stack direction={'row'} spacing={1}>
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label={t('content.common.sampleCsv')}
        loadIndicator={t('content.common.downloading')}
        loading={downloadingSample}
        onButtonClick={() => download('sample')}
        size="small"
        variant="text"
      />
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label={t('content.common.sampleTemplate')}
        loadIndicator={t('content.common.downloading')}
        loading={downloadingTemplate}
        onButtonClick={() => download('template')}
        size="small"
        variant="text"
      />
    </Stack>
  );
}
