import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider } from '@mui/material';
import { IConsumerDataOffers } from '../models/ConsumerContractOffers';

interface IntDialogProps {
  open: boolean;
  offerObj?: IConsumerDataOffers;
  handleClose?: (flag: boolean) => void;
}

const OfferDetailsDialog: React.FC<IntDialogProps> = ({ open, offerObj, handleClose }) => {
  const [offer] = useState(offerObj);

  const { typeOfAccess, bpnNumbers, title, created, description, publisher, usagePolicies, fileContentType } = offer;

  const closeModal = (flag: boolean) => {
    handleClose(flag);
  };

  function splitWithFirstOcc(str: string) {
    const regX = /:(.*)/s;
    return str.split(regX);
  }

  return (
    <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={() => closeModal(false)}>
      <DialogTitle>Offer Details</DialogTitle>
      <DialogContent dividers>
        <Grid container>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Title</Typography>
            <Typography variant="body2">
              <strong>{title || '-'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Creation Date</Typography>
            <Typography variant="body2">
              <strong>{created || '-'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Data Format</Typography>
            <Typography variant="body2">
              <strong>{fileContentType || '-'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Description</Typography>
            <Typography variant="body2">
              <strong>{description || '-'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Publisher</Typography>
            <Typography variant="body2">
              <strong>{splitWithFirstOcc(publisher)[0] || '-'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ mb: 1 }}>
            <Typography variant="body2">Publisher URL</Typography>
            <Typography variant="body2">
              <strong>{splitWithFirstOcc(publisher)[1] || '-'}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ m: 1 }} />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
              Access Type
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Type</Typography>
            <Typography variant="body2">
              <strong>{typeOfAccess}</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {typeOfAccess.toLowerCase() !== 'unrestricted' && (
              <>
                <Typography variant="body2">BPN Numbers</Typography>
                <Typography variant="body2" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {bpnNumbers.map((i, k) => {
                    return (
                      <strong key={k}>
                        {k !== 0 ? ', ' : ''} {i}
                      </strong>
                    );
                  })}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ m: 1 }} />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
              Usage Policy
            </Typography>
          </Grid>
          {usagePolicies.map((item, index) => {
            return (
              <Grid item xs={6} sx={{ mb: 1 }} key={index}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {item.type.toLowerCase()}
                </Typography>
                <Typography variant="body2">
                  Type:
                  <strong>{item.typeOfAccess}</strong>
                </Typography>

                {item.typeOfAccess.toLowerCase() !== 'unrestricted' && (
                  <>
                    <Typography variant="body2">
                      Value:
                      <strong>{item.value || '-'}</strong>
                    </Typography>
                  </>
                )}
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => closeModal(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferDetailsDialog;
