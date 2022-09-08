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
import UploadForm from '../components/UploadForm';

// icons
import { HighlightOffOutlined, ReportGmailerrorredOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

// models
import { Status } from '../models/ProcessReport';

// styles
import styles from '../styles.module.scss';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/store';
import { handleDialogOpen } from '../store/accessUsagePolicySlice';
import { setUploadStatus } from '../store/providerSlice';

export default function UploadFile({
  handleFiles,
  selectedTabIndex = 0,
}: {
  handleFiles: (file: File) => void;
  selectedTabIndex: number;
}) {
  const { selectedFiles, currentUploadData, uploadStatus } = useAppSelector(state => state.providerSlice);
  const dispatch = useAppDispatch();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        <Button
          disabled={selectedFiles.length === 0 && !uploadStatus}
          variant="contained"
          onClick={() => dispatch(handleDialogOpen({ type: 'file' }))}
        >
          Next Step - Configure Policies
        </Button>
      </Box>
      <Box sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <UploadForm getSelectedFiles={(files: File) => handleFiles(files)} />
          {uploadStatus && currentUploadData.status === Status.failed && (
            <div className={'flex justify-between bg-red-100 p-4 w-full mt-4'}>
              <div className="flex items-center gap-x-2">
                <span title="Failed">
                  <HighlightOffOutlined sx={{ color: styles.danger }} />
                </span>
                <p className="text-md">{selectedFiles[0].name}</p>
              </div>
              <span className="cursor-pointer" onClick={() => dispatch(setUploadStatus(false))}>
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
                <span className="cursor-pointer" onClick={() => dispatch(setUploadStatus(false))}>
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
                <span className="cursor-pointer" onClick={() => dispatch(setUploadStatus(false))}>
                  <CloseIcon />
                </span>
              </div>
            )}
        </div>
      </Box>
    </>
  );
}
