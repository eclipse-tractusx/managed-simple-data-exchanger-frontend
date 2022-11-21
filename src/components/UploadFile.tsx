/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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

// components
import UploadForm from '../components/UploadForm';
// styles
import { Box } from '@mui/material';
import { Button } from 'cx-portal-shared-components';
import { useAppDispatch, useAppSelector } from '../store/store';
import { handleDialogOpen } from '../features/policies/slice';

export default function UploadFile() {
  const { selectedFiles, uploadStatus } = useAppSelector(state => state.providerSlice);
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
          height: '100%',
        }}
      >
        <Button
          disabled={selectedFiles.length === 0 && !uploadStatus}
          size="small"
          variant="contained"
          onClick={() => dispatch(handleDialogOpen({ type: 'file' }))}
        >
          Next Step - Configure Policies
        </Button>
      </Box>
      <Box sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <UploadForm />
      </Box>
    </>
  );
}
