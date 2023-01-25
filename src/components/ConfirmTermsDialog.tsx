/********************************************************************************
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

import { Box, Checkbox, CircularProgress, FormControlLabel } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogHeader } from 'cx-portal-shared-components';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { IConsumerDataOffers } from '../models/ConsumerContractOffers';

interface IntConfirmOffer {
  offers?: IConsumerDataOffers[] | [];
  offerCount?: number;
  provider: string;
}
interface IntDialogProps {
  title?: string;
  open: boolean;
  handleButtonEvent?: (type: string) => void;
  isProgress?: boolean;
  offerObj?: IntConfirmOffer;
}

const ConfirmTermsDialog: React.FC<IntDialogProps> = ({
  title = 'Confirm',
  open = false,
  handleButtonEvent,
  isProgress = false,
  children,
  offerObj,
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { t } = useTranslation();

  const handleButton = (type: string) => {
    handleButtonEvent(type);
  };

  function splitWithFirstOcc(str: string) {
    const regX = /:(.*)/s;
    return str.split(regX);
  }

  return (
    <Dialog open={open}>
      <DialogHeader closeWithIcon onCloseWithIcon={() => handleButton('close')} title={title} />
      <DialogContent dividers sx={{ py: 3 }}>
        {children ? (
          children
        ) : (
          <>
            <Box sx={{ mb: 1 }}>
              {offerObj?.offerCount !== 0 && (
                <p>
                  <Trans i18nKey={'dialog.offerDetails.confirmTermsTitle'} count={offerObj.offerCount} />
                </p>
              )}
              <p>
                {t('dialog.offerDetails.cofirmTermsSubtitle')}
                {offerObj ? (
                  <strong style={{ margin: '0 5px' }}>{`${splitWithFirstOcc(offerObj.provider)[0]}.` || '-.'}</strong>
                ) : (
                  '-.'
                )}
              </p>
              <p>{t('dialog.offerDetails.confirmHeading')}</p>
            </Box>
            <p>(1) {t('dialog.offerDetails.point1')}</p>
            <p>(2) {t('dialog.offerDetails.point2')}</p>
            <p>(3) {t('dialog.offerDetails.point3')}</p>
            <FormControlLabel
              control={<Checkbox checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} name="gilad" />}
              label={t('content.common.agree')}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" disabled={isProgress} onClick={() => handleButton('close')}>
          {t('button.cancel')}
        </Button>
        <Button variant="contained" disabled={isProgress || !isAgreed} onClick={() => handleButton('confirm')}>
          {isProgress ? 'Loading..' : 'Confirm'}
          {isProgress && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmTermsDialog;
