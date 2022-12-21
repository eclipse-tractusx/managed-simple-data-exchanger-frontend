import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Stack } from '@mui/material';
import { LoadingButton } from 'cx-portal-shared-components';
import { useState } from 'react';

import AppService from '../services/appService';
import { useAppSelector } from '../store/store';

export default function DownloadCSV() {
  const { selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const [downloadingSample, setdownloadingSample] = useState(false);
  const [downloadingTemplate, setdownloadingTemplate] = useState(false);

  async function download(type: string) {
    try {
      if (type === 'sample') {
        setdownloadingSample(true);
      } else {
        setdownloadingTemplate(true);
      }
      const response = await AppService.getInstance().downloadCSV(selectedSubmodel.value, type);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}-${selectedSubmodel.value}.csv`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.log('Error downloading file', error);
    } finally {
      setdownloadingSample(false);
      setdownloadingTemplate(false);
    }
  }

  return (
    <Stack direction={'row'} spacing={1}>
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label="Sample CSV"
        loadIndicator="Downloading ..."
        loading={downloadingSample}
        onButtonClick={() => download('sample')}
        size="small"
        variant="text"
      />
      <LoadingButton
        endIcon={<FileDownloadIcon />}
        label="CSV Template"
        loadIndicator="Downloading ..."
        loading={downloadingTemplate}
        onButtonClick={() => download('template')}
        size="small"
        variant="text"
      />
    </Stack>
  );
}
