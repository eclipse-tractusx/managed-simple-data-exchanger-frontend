/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright 2022 Catena-X
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// components
import Timer from '../components/Timer';
import UploadForm from '../components/UploadForm';

// icons
import { HighlightOffOutlined, ReportGmailerrorredOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

// models
import { CsvTypes, Status } from '../models/ProcessReport';

// utils
import { formatDate } from '../utils/utils';

// styles
import styles from '../styles.module.scss';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export default function UploadFile({
  uploading = false,
  uploadStatus = false,
  uploadFile = (_e: any) => {
    /* This is itentional */
  },
  selectedFiles = [] as any,
  removeSelectedFiles = (_clearState: boolean) => {
    /* This is itentional */
  },
  setUploadStatus = (_status: boolean) => {
    /* This is itentional */
  },
  handleFiles = (_files: File) => {
    /* This is itentional */
  },
  currentUploadData = {
    processId: '',
    csvType: CsvTypes.unknown,
    numberOfItems: 0,
    numberOfFailedItems: 0,
    numberOfSucceededItems: 0,
    status: Status.inProgress,
    startDate: '',
  },
  selectedTabIndex = 0,
}) {
  const UploadContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  return (
    <UploadContainer>
      <div className="flex flex-1 flex-col items-center justify-center min-w-0 relative">
        {selectedFiles.length && !uploadStatus ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <Button variant="contained" onClick={uploadFile}>
              SUBMIT DATA
            </Button>
          </Box>
        ) : (
          <></>
        )}
        <div className="flex-[1_0_0%] flex order-1">
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={100} />
                <Timer />
                <span>
                  Upload started at: &nbsp;
                  {currentUploadData.startDate && formatDate(currentUploadData.startDate)}
                  {!currentUploadData.startDate && '-'}
                </span>
              </div>
            ) : null}
            {!uploading && (
              <UploadForm
                // eslint-disable-next-line
                getSelectedFiles={(files: any) => handleFiles(files)}
                selectedFiles={selectedFiles}
                removeSelectedFiles={removeSelectedFiles}
                uploadStatus={uploadStatus}
              />
            )}
            {uploadStatus && currentUploadData.status === Status.failed && (
              <div className={'flex justify-between bg-red-100 p-4 w-full mt-4'}>
                <div className="flex items-center gap-x-2">
                  <span title="Failed">
                    <HighlightOffOutlined sx={{ color: styles.danger }} />
                  </span>
                  <p className="text-md">{selectedFiles[0].name}</p>
                </div>
                <span className="cursor-pointer" onClick={() => setUploadStatus(false)}>
                  <CloseIcon />
                </span>
              </div>
            )}
            {selectedTabIndex === 0 &&
              uploadStatus &&
              currentUploadData.status === Status.completed &&
              currentUploadData.numberOfFailedItems === 0 && (
                <div className={'flex justify-between bg-lime-200 p-4 w-full mt-4'}>
                  <div className="flex items-center gap-x-2">
                    <span title="Completed">
                      <CheckCircleOutlineOutlinedIcon sx={{ color: styles.success }} />
                    </span>
                    <p className="text-md">{selectedFiles[0]?.name}</p>
                  </div>
                  <span className="cursor-pointer" onClick={() => setUploadStatus(false)}>
                    <CloseIcon />
                  </span>
                </div>
              )}
            {selectedTabIndex === 0 &&
              uploadStatus &&
              currentUploadData.status === Status.completed &&
              currentUploadData.numberOfFailedItems > 0 && (
                <div className={'flex justify-between bg-orange-100 p-4 w-full mt-4'}>
                  <div className="flex items-center gap-x-2">
                    <span title="Completed with warnings">
                      <ReportGmailerrorredOutlined sx={{ color: styles.warning }} />
                    </span>
                    <p className="text-md">{selectedFiles[0]?.name}</p>
                  </div>
                  <span className="cursor-pointer" onClick={() => setUploadStatus(false)}>
                    <CloseIcon />
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </UploadContainer>
  );
}
