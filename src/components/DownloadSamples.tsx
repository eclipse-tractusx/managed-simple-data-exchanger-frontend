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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Stack } from '@mui/material';
import { LoadingButton } from 'cx-portal-shared-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDownloadSampleMutation } from '../features/provider/submodels/apiSlice';
import { csvFileDownload } from '../helpers/FileDownloadHelper';

export default function DownloadSamples({ submodel }: { submodel: string }) {
  const [downloadingSample, setdownloadingSample] = useState(false);
  const [downloadingTemplate, setdownloadingTemplate] = useState(false);
  const { t } = useTranslation();
  const [downloadSample] = useDownloadSampleMutation();

  async function download(type: string) {
    if (type === 'sample') {
      setdownloadingSample(true);
    } else if (type === 'template') {
      setdownloadingTemplate(true);
    }

    await downloadSample({ submodel, type })
      .unwrap()
      .then(res => {
        const fileName = `${type}-${submodel}`;
        csvFileDownload(res, fileName);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setdownloadingSample(false);
        setdownloadingTemplate(false);
      });
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
