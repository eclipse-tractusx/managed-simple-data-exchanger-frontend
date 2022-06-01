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

import React, { useEffect, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import StickyHeadTable from '../components/Table';
import { ProcessReport } from '../models/ProcessReport';
import dft from '../api/dft';
import styles from '../styles.module.scss';

export const UploadHistory: React.FC = () => {
  const [tableData, setTableData] = useState<ProcessReport[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

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

  const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: styles.white,
    backgroundColor: styles.blue,
    '&:hover': {
      backgroundColor: styles.white,
      color: styles.blue,
    },
  }));

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
};

export default UploadHistory;
