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

import React from 'react';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import DynamicTable from '../components/DynamicTable';
import { serialPartTypizationColumns } from '../helpers/SerialPartTypizationColumns';
import { assemblyPartRelationshipColumns } from '../helpers/AssemblyPartRelationshipColumns';

export const CreateData: React.FC = () => {
  const [v, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  return (
    <div className="flex-1 py-6 px-10">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={v} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Serial Part Typization" {...a11yProps(0)} />
              <Tab label="Assembly Part Relationship" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={v} index={0}>
            <DynamicTable columns={serialPartTypizationColumns}></DynamicTable>
          </TabPanel>
          <TabPanel value={v} index={1}>
            <DynamicTable
              columns={assemblyPartRelationshipColumns}
              headerHeight={90}
              submitUrl={'/aspect/aspect-relationship'}
            ></DynamicTable>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateData;
