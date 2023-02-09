/* eslint-disable @typescript-eslint/indent */
/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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

import {
  AccessTime,
  HighlightOffOutlined,
  HourglassEmptyOutlined,
  ReportGmailerrorredOutlined,
} from '@mui/icons-material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material';
import { IconButton, Tooltips } from 'cx-portal-shared-components';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { setSnackbarMessage } from '../features/notifiication/slice';
import { useDeleteHistoryMutation } from '../features/provider/history/apiSlice';
import { useAppDispatch } from '../features/store';
import { ProcessReport, Status } from '../models/ProcessReport';
import AppService from '../services/appService';
import { formatDate } from '../utils/utils';
import Permissions from './Permissions';

interface Column {
  id:
    | 'processId'
    | 'csvType'
    | 'numberOfItems'
    | 'numberOfSucceededItems'
    | 'numberOfUpdatedItems'
    | 'numberOfDeletedItems'
    | 'numberOfFailedItems'
    | 'status'
    | 'startDate'
    | 'duration'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string) => string;
}

const columns: readonly Column[] = [
  {
    id: 'processId',
    label: 'Process Id',
    minWidth: 300,
  },
  { id: 'csvType', label: 'CSV Type', minWidth: 100 },
  {
    id: 'numberOfSucceededItems',
    label: 'Number of Created Items',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'numberOfUpdatedItems',
    label: 'Number of Updated Items',
    minWidth: 160,
    align: 'center',
  },
  {
    id: 'numberOfDeletedItems',
    label: 'Number of Deleted Items',
    minWidth: 160,
    align: 'center',
  },
  {
    id: 'numberOfFailedItems',
    label: 'Number of Failed Items',
    minWidth: 160,
    align: 'center',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
    align: 'center',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    minWidth: 170,
    align: 'center',
    format: (value: string) => formatDate(value),
  },
  {
    id: 'duration',
    label: 'Duration',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'actions',
    label: '',
    minWidth: 100,
  },
];

const rowsData: ProcessReport[] = [];

export default function StickyHeadTable({
  rows = rowsData,
  page = 0,
  rowsPerPage = 10,
  totalElements = 0,
  // eslint-disable-next-line
  setPage = (_p: number) => {
    /* This is itentional */
  },
  // eslint-disable-next-line
  setRowsPerPage = (_r: number) => {
    /* This is itentional */
  },
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const caclDuration = (row: ProcessReport) => {
    if (row.startDate && row.endDate) {
      const time = new Date(row.endDate).getTime() - new Date(row.startDate).getTime();

      const minutes = Math.floor(time / 60000);
      let seconds = Number(((time % 60000) / 1000).toFixed(0));

      if (minutes === 0 && seconds === 0) {
        seconds = 1;
      }

      return (minutes < 10 ? '0' : '') + minutes + 'm:' + (seconds < 10 ? '0' : '') + seconds + 's';
    }
    return '-';
  };

  const [deleteHistory] = useDeleteHistoryMutation();
  const deleteSubmodal = async (subModel: ProcessReport) => {
    try {
      await deleteHistory(subModel);
    } catch (error) {
      console.log(error);
    }
  };

  async function download(subModel: ProcessReport) {
    try {
      const { csvType, processId } = subModel;
      const response = await AppService.getInstance().downloadHistory(csvType, processId);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${csvType}-${processId}.csv`);
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
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {t(`content.uploadHistory.columns.${column.id}`)}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.processId}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.id === 'csvType' && <strong> {value} </strong>}
                        {column.id !== 'status' &&
                          column.id !== 'csvType' &&
                          column.id !== 'startDate' &&
                          (!column.format || typeof value === 'string') &&
                          value}
                        {column.id === 'startDate' && column.format && column.format(value as string)}
                        {column.id === 'processId' && row.referenceProcessId && (
                          <p>
                            (Deletion of <span style={{ color: 'red' }}>{row.referenceProcessId}</span>)
                          </p>
                        )}
                        {column.id === 'status' && value === Status.completed && row.numberOfFailedItems === 0 && (
                          <span title="Completed">
                            <CheckCircleOutlineOutlinedIcon
                              fontSize="small"
                              sx={{ color: theme.palette.success.main }}
                            />
                          </span>
                        )}
                        {column.id === 'status' && value === Status.completed && row.numberOfFailedItems > 0 && (
                          <span title="Completed with warnings">
                            <ReportGmailerrorredOutlined fontSize="small" sx={{ color: theme.palette.warning.main }} />
                          </span>
                        )}
                        {column.id === 'status' && value === Status.failed && (
                          <span title="Failed">
                            <HighlightOffOutlined fontSize="small" sx={{ color: theme.palette.error.main }} />
                          </span>
                        )}
                        {column.id === 'status' && value === Status.inProgress && (
                          <span title="In progress">
                            <HourglassEmptyOutlined fontSize="small" sx={{ color: theme.palette.primary.main }} />
                          </span>
                        )}
                        {column.id === 'duration' && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              marginLeft: 20,
                            }}
                          >
                            <AccessTime fontSize="small" />
                            <span style={{ marginLeft: 5 }}>{caclDuration(row)}</span>
                          </div>
                        )}
                        <Permissions values={['provider_delete_contract_offer']}>
                          {column.id === 'actions' && row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                            <Tooltips tooltipPlacement="bottom" tooltipText="Delete">
                              <span>
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => deleteSubmodal(row)}
                                  sx={{ mr: 2 }}
                                >
                                  <DeleteIcon color="error" fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltips>
                          )}
                        </Permissions>
                        <Permissions values={['provider_download_own_data']}>
                          {column.id === 'actions' && row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                            <Tooltips tooltipPlacement="bottom" tooltipText="Download">
                              <span>
                                <IconButton aria-label="delete" size="small" onClick={() => download(row)}>
                                  <DownloadIcon color="primary" fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltips>
                          )}
                        </Permissions>
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
