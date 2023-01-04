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
            message: t('alerts.downloadSuccess'),
            type: 'success',
          }),
        );
      }
    } catch (error) {
      dispatch(
        setSnackbarMessage({
          message: t('alerts.downloadError'),
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
