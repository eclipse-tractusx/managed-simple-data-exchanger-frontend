/********************************************************************************
 * Copyright (c) 2023,2024 T-Systems International GmbH
 * Copyright (c) 2023,2024 Contributors to the Eclipse Foundation
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
import { LoadingButton } from '@catena-x/portal-shared-components';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { csvFileDownload } from '../helpers/FileDownloadHelper';
import AppService from '../services/appService';

export default function DownloadSamples({ submodel }: Readonly<{ submodel: string }>) {
  const [downloadingSample, setDownloadingSample] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const { t } = useTranslation();

  async function download(type: string) {
    if (type === 'sample') {
      setDownloadingSample(true);
    } else if (type === 'template') {
      setDownloadingTemplate(true);
    }
    try {
      const { data } = await AppService.getInstance().downloadCSV(submodel, type);
      if (data) {
        const fileName = `${type}-${submodel}`;
        csvFileDownload(data, fileName);
      }
    } finally {
      setDownloadingSample(false);
      setDownloadingTemplate(false);
    }
  }

  return (
    <Stack direction={'row'} spacing={2}>
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label={t('content.common.sampleCsv')}
        loadIndicator={t('content.common.downloading')}
        loading={downloadingSample}
        onButtonClick={() => download('sample')}
        size="small"
        variant="outlined"
      />
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label={t('content.common.sampleTemplate')}
        loadIndicator={t('content.common.downloading')}
        loading={downloadingTemplate}
        onButtonClick={() => download('template')}
        size="small"
        variant="outlined"
      />
    </Stack>
  );
}
