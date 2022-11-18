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

import { SyntheticEvent, useEffect, useState } from 'react';
import { Box, Grid, TextareaAutosize, useTheme } from '@mui/material';
import { Button, Tab, TabPanel, Tabs, Typography } from 'cx-portal-shared-components';
import UploadFile from '../components/UploadFile';
import { useAppDispatch, useAppSelector } from '../store/store';
import SelectSubmodel from '../components/SelectSubmodel';
import DataTable from '../components/DataTable';
import { fetchSubmodelDetails, submitJsonData } from '../features/submodels/actions';
import { setJsonInputData } from '../features/submodels/slice';

export default function CreateData() {
  const theme = useTheme();
  const { submodelDetails, selectedSubmodel, jsonInputData } = useAppSelector(state => state.submodelSlice);

  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    dispatch(fetchSubmodelDetails(selectedSubmodel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textareaStyle = {
    width: '100%',
    border: `1px solid ${theme.palette.grey[500]}`,
    marginTop: '16px',
    padding: '16px',
    borderRadius: 4,
    fontSize: 16,
  };

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={3}>
          <SelectSubmodel />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" sx={{ pt: 0 }}>
              <Tab label="Upload File" />
              <Tab label="Table" />
              <Tab label="JSON" />
            </Tabs>
          </Box>
          <Box>
            <TabPanel value={activeTab} index={0}>
              <UploadFile />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <DataTable />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <Grid display={'flex'} justifyContent="center" alignContent={'center'} pt={4}>
                <Grid item xs={4}>
                  <Typography variant="h4">{submodelDetails.title}</Typography>
                  <TextareaAutosize
                    value={jsonInputData}
                    minRows={20}
                    placeholder={JSON.stringify(submodelDetails.examples, undefined, 4)}
                    style={{ ...textareaStyle }}
                    onChange={e => {
                      dispatch(setJsonInputData(e.target.value));
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => dispatch(submitJsonData(jsonInputData))}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Next Step - Configure Policies
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
