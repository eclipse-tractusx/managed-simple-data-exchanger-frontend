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

import React, { useRef } from 'react';
import { Box, Button, CircularProgress, Grid, Tab, Tabs, TextareaAutosize } from '@mui/material';
import DynamicTable from '../components/DynamicTable';
import Timer from '../components/Timer';
import { CsvTypes, ProcessReport, Status } from '../models/ProcessReport';
import { getSerialPartTypizationColumns } from '../helpers/SerialPartTypizationColumns';
import { getAssemblyPartRelationshipColumns } from '../helpers/AssemblyPartRelationshipColumns';
import { formatDate } from '../utils/utils';
import { SerialPartTypization } from '../models/SerialPartTypization';
import { AssemblyPartRelationship } from '../models/AssemblyPartRelationship';
import dft from '../api/dft';
import Swal from 'sweetalert2';

const serialPartInitialData = [
  {
    uuid: '',
    part_instance_id: '',
    manufacturing_date: '',
    manufacturing_country: '',
    manufacturer_part_id: '',
    customer_part_id: '',
    classification: '',
    name_at_manufacturer: '',
    name_at_customer: '',
    optional_identifier_key: '',
    optional_identifier_value: '',
  },
];

const assemblyRelationshipInitialData = [
  {
    parent_uuid: '',
    parent_part_instance_id: '',
    parent_manufacturer_part_id: '',
    parent_optional_identifier_key: '',
    parent_optional_identifier_value: '',
    uuid: '',
    part_instance_id: '',
    manufacturer_part_id: '',
    optional_identifier_key: '',
    optional_identifier_value: '',
    lifecycle_context: '',
    quantity_number: '',
    measurement_unit_lexical_value: '',
    datatype_uri: '',
    assembled_on: '',
  },
];

export default function CreateData({
  // eslint-disable-next-line
  processingReportFirstCall = (_processId: string) => {
    /* This is itentional */
  },
  // eslint-disable-next-line
  setUploading = (_status: boolean) => {
    /* This is itentional */
  },
  uploading = false,
  currentUploadData = {
    processId: '',
    csvType: CsvTypes.unknown,
    numberOfItems: 0,
    numberOfFailedItems: 0,
    numberOfSucceededItems: 0,
    status: Status.inProgress,
    startDate: '',
  },
  // eslint-disable-next-line
  setUploadData = (_data: ProcessReport) => {
    /* This is itentional */
  },
}) {
  const ref = useRef(null);
  const [v, setValue] = React.useState(0);
  const [serialTemplate] = React.useState<SerialPartTypization[]>(serialPartInitialData);
  const [assemblyTemplate] = React.useState<AssemblyPartRelationship[]>(assemblyRelationshipInitialData);

  const getInvalidDataMessage = () => {
    return Swal.fire({
      title: 'Invalid data!',
      html: '<p> Fields with * are required. </p> <p> Optional value(s) and Optional key(s) must either be empty or both filled. </p>',
      icon: 'error',
      confirmButtonColor: '#01579b',
    });
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getSerialPlaceholder = () => {
    return JSON.stringify(serialTemplate, undefined, 4);
  };

  const getAssemblyPlaceholder = () => {
    return JSON.stringify(assemblyTemplate, undefined, 4);
  };

  const validateSerialPartFiedls = (value: SerialPartTypization[]) => {
    const auxRows = JSON.parse(JSON.stringify(value));
    if (auxRows && auxRows.length > 0) {
      for (const r of auxRows) {
        if (
          r.part_instance_id === '' ||
          r.manufacturing_date === '' ||
          r.manufacturer_part_id === '' ||
          r.classification === '' ||
          r.name_at_manufacturer === '' ||
          (r.optional_identifier_value === '' && r.optional_identifier_key !== '') ||
          (r.optional_identifier_value !== '' && r.optional_identifier_key === '')
        ) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  const validateAssemblyRelationshipFiedls = (value: AssemblyPartRelationship[]) => {
    const auxRows = JSON.parse(JSON.stringify(value));
    if (auxRows && auxRows.length > 0) {
      for (const r of auxRows) {
        if (
          r.parent_part_instance_id === '' ||
          r.parent_manufacturer_part_id === '' ||
          r.part_instance_id === '' ||
          r.manufacturer_part_id === '' ||
          r.lifecyle_context === '' ||
          r.quantity_number === '' ||
          r.measurement_unit_lexical_value === '' ||
          r.datatype_uri === '' ||
          r.assembled_on === '' ||
          (r.optional_identifier_value === '' && r.optional_identifier_key !== '') ||
          (r.optional_identifier_value !== '' && r.optional_identifier_key === '') ||
          (r.parent_optional_identifier_key === '' && r.parent_optional_identifier_value !== '') ||
          (r.parent_optional_identifier_key !== '' && r.parent_optional_identifier_value === '')
        ) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  const submitData = (value: SerialPartTypization[] | AssemblyPartRelationship[], submitUrl: string) => {
    let valid = false;

    if (value.hasOwnProperty('parent_uuid')) {
      // assembly part relationship
      valid = validateAssemblyRelationshipFiedls(value as AssemblyPartRelationship[]);
    } else {
      // serial part
      valid = validateSerialPartFiedls(value as SerialPartTypization[]);
    }
    const auxRows = JSON.parse(JSON.stringify(value));

    if (valid) {
      // eslint-disable-next-line
      auxRows.forEach((auxRow: any) => {
        Object.keys(auxRow).forEach(k => {
          if (auxRow[k] === '') {
            auxRow[k] = null;
          }
        });
      });

      setUploading(true);

      dft
        .post(submitUrl, auxRows)
        .then(resp => {
          const processId = resp.data;

          // first call
          processingReportFirstCall(processId);
        })
        .catch(() => {
          setUploadData({ ...currentUploadData, status: Status.failed });
        });
    } else {
      getInvalidDataMessage();
    }
  };

  const submitSerialData = () => {
    let json;
    try {
      json = JSON.parse(ref.current.value.trim());
    } catch (e) {
      getInvalidDataMessage();
    }

    if (json) {
      submitData(json, '/aspect');
    }
  };

  const submitAssemblyData = () => {
    let json;
    try {
      json = JSON.parse(ref.current.value.trim());
    } catch (e) {
      getInvalidDataMessage();
    }

    if (json) {
      submitData(json, '/aspect/relationship');
    }
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
            <span>{children}</span>
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
      {uploading ? (
        <div className="flex flex-1 flex-col items-center justify-center min-w-0 relative mt-8">
          <div className="flex-[1_0_0%] flex order-1">
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <CircularProgress size={100} />
                <Timer />
                <span>
                  Upload started at: &nbsp;
                  {currentUploadData.startDate && formatDate(currentUploadData.startDate)}
                  {!currentUploadData.startDate && '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {!uploading ? (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={v} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Serial Part Typization" {...a11yProps(0)} />
                  <Tab label="Assembly Part Relationship" {...a11yProps(1)} />
                  <Tab label="JSON" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={v} index={0}>
                <DynamicTable
                  columns={getSerialPartTypizationColumns()}
                  submitUrl={'/aspect'}
                  submitData={submitData}
                ></DynamicTable>
              </TabPanel>
              <TabPanel value={v} index={1}>
                <DynamicTable
                  columns={getAssemblyPartRelationshipColumns()}
                  submitUrl={'/aspect/relationship'}
                  headerHeight={90}
                  submitData={submitData}
                ></DynamicTable>
              </TabPanel>
              <TabPanel value={v} index={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <h1 className="flex flex-row text-bold text-3xl">Serial Part Typization</h1>
                    <TextareaAutosize
                      ref={ref}
                      minRows={20}
                      placeholder={getSerialPlaceholder()}
                      style={{ width: '100%', border: '1px solid black', marginTop: '10px' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h1 className="flex flex-row text-bold text-3xl">Assembly Part Relationship</h1>
                    <TextareaAutosize
                      minRows={20}
                      placeholder={getAssemblyPlaceholder()}
                      style={{ width: '100%', border: '1px solid black', marginTop: '10px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button variant="outlined" onClick={submitSerialData} sx={{ mt: 2 }} style={{ float: 'right' }}>
                      Submit data
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" onClick={submitAssemblyData} sx={{ mt: 2 }} style={{ float: 'right' }}>
                      Submit data
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </div>
      ) : null}
    </div>
  );
}
