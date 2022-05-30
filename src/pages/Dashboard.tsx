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

import React, { SyntheticEvent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import Timer from '../components/Timer';
import UploadForm from '../components/UploadForm';
import { FileType } from '../models/FileType';
import { File } from '../models/File';
import { CsvTypes, ProcessReport, Status } from '../models/ProcessReport';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import Notification from '../components/Notification';
import dft from '../api/dft';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StickyHeadTable from '../components/StickyHeadTable';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Button, { ButtonProps } from '@mui/material/Button';
import { HighlightOffOutlined, Refresh, ReportGmailerrorredOutlined } from '@mui/icons-material';
import { formatDate } from '../utils/utils';
import styles from '../styles.module.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import '../styles/Table.scss';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tableData, setTableData] = useState<ProcessReport[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentUploadData, setUploadData] = useState<ProcessReport>({
    processId: '',
    csvType: CsvTypes.unknown,
    numberOfItems: 0,
    numberOfFailedItems: 0,
    numberOfSucceededItems: 0,
    status: Status.inProgress,
    startDate: '',
    endDate: undefined,
  });
  let dragCounter = 0;

  const refreshTable = () => {
    dft.get(`/processing-report?page=${page}&pageSize=${rowsPerPage}`).then(response => {
      setTableData(response.data.items);
      setTotalElements(response.data.totalItems);
    });
  };

  useEffect(() => {
    const refresh = () => {
      dft.get(`/processing-report?page=${page}&pageSize=${rowsPerPage}`).then(response => {
        setTableData(response.data.items);
        setTotalElements(response.data.totalItems);
      });
    };

    refresh();
  }, [page, rowsPerPage]);

  const handleExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  const validateFile = (file: File) => {
    const validTypes: string[] = Object.values(FileType);
    return validTypes.includes(file.type) || file.name.endsWith('.csv');
  };

  const handleFiles = (file: File) => {
    setUploadStatus(false);
    setUploading(false);
    const maxFileSize = parseInt(process.env.REACT_APP_FILESIZE);
    if (validateFile(file) && file.size < maxFileSize) {
      setSelectedFiles([file]);
    } else {
      file.invalid = true;
      setErrorMessage('File not permitted');
    }
  };

  // eslint-disable-next-line
  const dragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  // eslint-disable-next-line
  const dragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter > 0) return;
    setIsDragging(false);
  };

  const removeSelectedFiles = (clearState: boolean) => {
    if (clearState) setSelectedFiles([]);
    setUploadStatus(false);
    setUploading(false);
  };

  // eslint-disable-next-line
  const fileDrop = (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length && files.length < 2 && selectedFiles.length === 0) {
      handleFiles(files[0]);
      setUploadStatus(false);
      setUploading(false);
    } else if (files.length && files.length < 2 && selectedFiles.length > 0) {
      setSelectedFiles([files[0]]);
      setUploadStatus(false);
      setUploading(false);
    } else {
      setErrorMessage('Only one file is permitted');
    }
    setIsDragging(false);
  };

  const getMenuIndex = (index = 0) => {
    setMenuIndex(index);
    if (index === 1) {
      refreshTable();
    }
  };

  const clearUpload = () => {
    setTimeout(() => {
      setUploading(false);
      setUploadStatus(true);
    }, 1000);
  };

  const processingReport = (r: { data: ProcessReport }, processId: string) => {
    setUploadData(r.data);
    if (r && r.data && r.data.status !== Status.completed && r.data.status !== Status.failed) {
      // if status !== 'COMPLETED' && status !== 'FAILED' -> set interval with 2 seconds to refresh data
      const interval = setInterval(
        () =>
          dft.get(`/processing-report/${processId}`).then(result => {
            setUploadData(result.data);
            if (
              result &&
              result.data &&
              (result.data.status === Status.completed || result.data.status === Status.failed)
            ) {
              clearInterval(interval);
              clearUpload();
            }
          }),
        2000,
      );
    } else {
      clearUpload();
    }
  };

  const processingReportFirstCall = (processId: string) => {
    setTimeout(() => {
      dft
        .get(`/processing-report/${processId}`)
        .then(r => {
          processingReport(r, processId);
        })
        .catch(error => {
          // if process id not ready - repeat request
          if (error.response.status === 404) {
            processingReportFirstCall(processId);
          } else {
            clearUpload();
          }
        });
    }, 2000);
  };

  // eslint-disable-next-line
  const uploadFile = (e: any) => {
    e.preventDefault();
    setUploading(true);
    setUploadData({
      processId: '',
      csvType: CsvTypes.unknown,
      numberOfItems: 0,
      numberOfFailedItems: 0,
      numberOfSucceededItems: 0,
      status: Status.inProgress,
      startDate: '',
      endDate: undefined,
    });

    const formData = new FormData();
    // eslint-disable-next-line
    formData.append('file', selectedFiles[0] as any);

    dft
      .post('/upload', formData)
      .then(resp => {
        const processId = resp.data;

        // first call
        processingReportFirstCall(processId);
      })
      .catch(() => {
        setUploadData({ ...currentUploadData, status: Status.failed });
        clearUpload();
      });
  };

  const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: styles.white,
    backgroundColor: styles.blue,
    '&:hover': {
      backgroundColor: styles.white,
      color: styles.blue,
    },
  }));

  const serialPartTypizationRows = [
    { name: 'UUID', mandatory: false, position: 1 },
    { name: 'part_instance_id', mandatory: true, position: 2 },
    { name: 'manufacturing_date', mandatory: true, position: 3 },
    { name: 'manufacturing_country', mandatory: false, position: 4 },
    { name: 'manufacturer_part_id', mandatory: true, position: 5 },
    { name: 'customer_part_id', mandatory: false, position: 6 },
    { name: 'classification', mandatory: true, position: 7 },
    { name: 'name_at_manufacturer', mandatory: true, position: 8 },
    { name: 'name_at_customer', mandatory: false, position: 9 },
    { name: 'optional_identifier_key', mandatory: false, position: 10 },
    { name: 'optional_identifier_value', mandatory: false, position: 11 },
  ];

  const assemblyPartRelationshipRows = [
    { name: 'parent_UUID', mandatory: false, position: 1 },
    { name: 'parent_part_instance_id', mandatory: true, position: 2 },
    { name: 'parent_manufacturer_part_id', mandatory: true, position: 3 },
    { name: 'parent_optional_identifier_key', mandatory: false, position: 4 },
    { name: 'parent_optional_identifier_value', mandatory: true, position: 5 },
    { name: 'UUID', mandatory: false, position: 6 },
    { name: 'part_instance_id', mandatory: true, position: 7 },
    { name: 'manufacturer_part_id', mandatory: true, position: 8 },
    { name: 'optional_identifier_key', mandatory: false, position: 9 },
    { name: 'optional_identifier_value', mandatory: false, position: 10 },
    { name: 'lifecycle_context', mandatory: true, position: 11 },
    { name: 'quantity_number', mandatory: true, position: 12 },
    { name: 'measurement_unit_lexical_value', mandatory: true, position: 13 },
    { name: 'datatype_URI', mandatory: true, position: 14 },
    { name: 'assembled_on', mandatory: true, position: 15 },
  ];

  const serialCardStyle = {
    display: 'block',
    transitionDuration: '0.3s',
    height: '645px',
  };

  const assemblyCardStyle = {
    display: 'block',
    transitionDuration: '0.3s',
    height: '784px',
  };

  const rulesCardStyle = {
    display: 'block',
    transitionDuration: '0.3s',
    height: '116px',
  };

  const copyHeadersToasty = () => {
    return toast.success('Copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const copyHeadersSerialPartTypization = () => {
    navigator.clipboard.writeText(
      'UUID;part_instance_id;manufacturing_date;manufacturing_country;manufacturer_part_id;customer_part_id;classification;name_at_manufacturer;name_at_customer;optional_identifier_key;optional_identifier_value',
    );

    copyHeadersToasty();
  };

  const copyHeadersAssemblyPartRelationship = () => {
    navigator.clipboard.writeText(
      'parent_UUID;parent_part_instance_id;parent_manufacturer_part_id;parent_optional_identifier_key;parent_optional_identifier_value;UUID;part_instance_id;manufacturer_part_id;optional_identifier_key;optional_identifier_value;lifecycle_context;quantity_number;measurement_unit_lexical_value;datatype_URI;assembled_on',
    );

    copyHeadersToasty();
  };

  // TODO: Replace this logic with routes
  const layout = () => {
    switch (menuIndex) {
      case 0:
        return (
          <div className="flex flex-1 flex-col items-center justify-center min-w-0 relative">
            <div className="flex-[1_0_0%] flex order-1">
              <div className="flex flex-col items-center justify-center">
                {uploading ? (
                  <div className="text-center">
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
                    // eslint-disable-next-line
                    emitFileUpload={(e: any) => uploadFile(e)}
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
                {uploadStatus &&
                  currentUploadData.status === Status.completed &&
                  currentUploadData.numberOfFailedItems === 0 && (
                    <div className={'flex justify-between bg-lime-200 p-4 w-full mt-4'}>
                      <div className="flex items-center gap-x-2">
                        <span title="Completed">
                          <CheckCircleOutlineOutlinedIcon sx={{ color: styles.success }} />
                        </span>
                        <p className="text-md">{selectedFiles[0].name}</p>
                      </div>
                      <span className="cursor-pointer" onClick={() => setUploadStatus(false)}>
                        <CloseIcon />
                      </span>
                    </div>
                  )}
                {uploadStatus &&
                  currentUploadData.status === Status.completed &&
                  currentUploadData.numberOfFailedItems > 0 && (
                    <div className={'flex justify-between bg-orange-100 p-4 w-full mt-4'}>
                      <div className="flex items-center gap-x-2">
                        <span title="Completed with warnings">
                          <ReportGmailerrorredOutlined sx={{ color: styles.warning }} />
                        </span>
                        <p className="text-md">{selectedFiles[0].name}</p>
                      </div>
                      <span className="cursor-pointer" onClick={() => setUploadStatus(false)}>
                        <CloseIcon />
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex-1 py-6 px-20">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h1 className="flex flex-row text-bold text-3xl">Upload History</h1>
              </Grid>
              <Grid item xs={6} className="text-right">
                <ColorButton variant="contained" onClick={() => refreshTable()}>
                  <span>
                    <Refresh />
                    &nbsp; Refresh
                  </span>
                </ColorButton>
              </Grid>
            </Grid>
            <div className="mt-8">
              <StickyHeadTable
                rows={tableData}
                page={page}
                rowsPerPage={rowsPerPage}
                totalElements={totalElements}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-1 py-6 px-20">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card style={rulesCardStyle}>
                  <CardContent>
                    <h3>
                      <b> Rules </b>
                    </h3>
                    <ul>
                      <li> &bull; The file must be a file of type CSV (.csv extension).</li>
                      <li> &bull; Data fields must be separated by a semicolon (;).</li>
                      <li> &bull; All data fields must be present even if empty.</li>
                    </ul>
                  </CardContent>
                </Card>
                &nbsp;
                <Card style={serialCardStyle}>
                  <CardContent>
                    <h2>
                      <b> SerialPartTypization </b>
                    </h2>
                    &nbsp;
                    <table>
                      <thead>
                        <tr>
                          <th> Name </th>
                          <th> Mandatory </th>
                          <th> Position </th>
                        </tr>
                      </thead>
                      <tbody>
                        {serialPartTypizationRows.map(row => (
                          <tr key={row.name}>
                            <td>{row.name}</td>
                            <td>{row.mandatory ? <b> Yes </b> : 'No'}</td>
                            <td>{row.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardActions>
                    <Button size="large" startIcon={<GetAppIcon />}>
                      <Link to="/resources/serialPartTypization.csv" target="_blank" download>
                        Download sample
                      </Link>
                    </Button>
                    <Button onClick={copyHeadersSerialPartTypization} size="large" startIcon={<ContentCopyIcon />}>
                      Copy headers to clipboard
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card style={assemblyCardStyle}>
                  <CardContent>
                    <h2>
                      <b>AssemblyPartRelationship </b>
                    </h2>
                    &nbsp;
                    <table>
                      <thead>
                        <tr>
                          <th> Name </th>
                          <th> Mandatory </th>
                          <th> Position </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assemblyPartRelationshipRows.map(row => (
                          <tr key={row.name}>
                            <td>{row.name}</td>
                            <td align="center">{row.mandatory ? <b> Yes </b> : 'No'}</td>
                            <td align="right">{row.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                  <CardActions>
                    <Button size="large" startIcon={<GetAppIcon />}>
                      <Link to="/resources/assemblyPartRelationship.csv" target="_blank" download>
                        Download sample
                      </Link>
                    </Button>
                    <Button onClick={copyHeadersAssemblyPartRelationship} size="large" startIcon={<ContentCopyIcon />}>
                      Copy headers to clipboard
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div
      className="max-w-screen-4xl my-0 mx-auto overflow-y-auto overflow-x-hidden h-screen block"
      onDragOver={(e: SyntheticEvent) => e.preventDefault()}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
    >
      {!isDragging && (
        <main className="flex-1 flex flex-row justify-start min-h-screen pt-16 relative">
          <Nav getIsExpanded={(expanded: boolean) => handleExpanded(expanded)} />
          <div className="flex">
            <Sidebar isExpanded={isExpanded} emitMenuIndex={(index: number) => getMenuIndex(index)} />
          </div>
          {errorMessage !== '' && (
            <div className={`${isExpanded ? 'left-64' : 'left-14'} absolute top-16 z-50 w-screen`}>
              <Notification errorMessage={errorMessage} clear={() => setErrorMessage('')} />
            </div>
          )}

          <div className="flex w-screen">{layout()}</div>
        </main>
      )}

      {isDragging && (
        <div className="relative w-full h-full bg-[#03a9f4]">
          <div className="inset-x-0 inset-y-1/2 absolute z-5 flex flex-col justify-center gap-y-2 text-center">
            <span>
              <UploadFileOutlinedIcon style={{ fontSize: 60 }} sx={{ color: styles.white }} />
            </span>
            <h1 className="text-4xl text-white">Drop it like it's hot :)</h1>
            <p className="text-lg text-white">Upload your file by dropping it in this window</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
