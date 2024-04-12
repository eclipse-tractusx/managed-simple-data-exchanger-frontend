/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Typography,
} from '@catena-x/portal-shared-components';
import { Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Permissions from '../../components/Permissions';
import { setOpenOfferConfirmDialog, setOpenOfferDetailsDialog } from '../../features/consumer/slice';
import { IConsumerDataOffers } from '../../features/consumer/types';
import { useAppDispatch, useAppSelector } from '../../features/store';
import UsagePolicies from './UsagePolicies';

interface IntDialogProps {
  offerObj?: IConsumerDataOffers;
  isMultiple?: boolean;
}

const OfferDetailsDialog = ({ offerObj, isMultiple }: IntDialogProps) => {
  const {
    title,
    description,
    sematicVersion,
    publisher,
    connectorOfferUrl,
    policy: { Usage: usagePolicies },
  } = offerObj ?? ({} as IConsumerDataOffers);

  const { t } = useTranslation();
  const { openOfferDetailsDialog } = useAppSelector(state => state.consumerSlice);

  const dispatch = useAppDispatch();

  const renderDetailItem = (label: string, value: string) => (
    <Grid item xs={6} sx={{ mb: 1 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2">
        <strong>{value || '-'}</strong>
      </Typography>
    </Grid>
  );

  return (
    <Dialog open={openOfferDetailsDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setOpenOfferDetailsDialog(false))}
        title={t('dialog.offerDetails.title')}
      />
      {isMultiple ? (
        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
                {t('content.policies.usagePolicy')}
              </Typography>
            </Grid>
            <UsagePolicies usagePolicies={usagePolicies} />
          </Grid>
        </DialogContent>
      ) : (
        <DialogContent dividers>
          <Grid container mt={3}>
            {renderDetailItem(t('dialog.offerDetails.titleText'), title)}
            {renderDetailItem(t('dialog.offerDetails.sematicVersion'), sematicVersion)}
            {renderDetailItem(t('dialog.offerDetails.description'), description)}
            {renderDetailItem(t('dialog.offerDetails.publisher'), publisher)}
            {renderDetailItem(t('dialog.offerDetails.publisherUrl'), connectorOfferUrl)}
          </Grid>
          <Divider sx={{ m: 1 }} />
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
                {t('content.policies.usagePolicy')}
              </Typography>
            </Grid>
            <UsagePolicies usagePolicies={usagePolicies} />
          </Grid>
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="outlined" onClick={() => dispatch(setOpenOfferDetailsDialog(false))}>
          {t('button.close')}
        </Button>
        <Permissions values={['consumer_establish_contract_agreement']}>
          <Button variant="contained" onClick={() => dispatch(setOpenOfferConfirmDialog(true))}>
            {t('button.subscribe')}
          </Button>
        </Permissions>
      </DialogActions>
    </Dialog>
  );
};

export default OfferDetailsDialog;
