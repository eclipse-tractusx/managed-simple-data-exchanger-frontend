/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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
import { Box, Grid, TextareaAutosize, useTheme } from '@mui/material';
import { Button, Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { setSnackbarMessage } from '../features/notifiication/slice';
import { setJsonInputData } from '../features/provider/submodels/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { schemaValidator } from '../helpers/SchemaValidator';

export default function JsonInput() {
  const theme = useTheme();
  const { submodelDetails, jsonInputData } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const submitData = async (data: string) => {
    try {
      const json = JSON.parse(data.trim());
      if (json) {
        await schemaValidator(json);
      }
    } catch (e) {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.invalidData',
          type: 'error',
        }),
      );
    }
  };
  const textareaStyle = {
    width: '100%',
    border: `1px solid ${theme.palette.grey[500]}`,
    marginTop: '16px',
    padding: '16px',
    borderRadius: 4,
    fontSize: 16,
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          size="small"
          onClick={() => submitData(jsonInputData)}
          disabled={!jsonInputData.length}
        >
          {t('content.policies.configure')}
        </Button>
      </Box>
      <Grid display={'flex'} justifyContent="center" alignContent={'center'} pt={4}>
        <Grid item xs={5}>
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
        </Grid>
      </Grid>
    </>
  );
}
