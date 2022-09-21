import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
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

  const handleButton = (type: string) => {
    handleButtonEvent(type);
  };

  function splitWithFirstOcc(str: string) {
    const regX = /:(.*)/s;
    return str.split(regX);
  }

  return (
    <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={() => handleButton('close')}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        {children ? (
          children
        ) : (
          <>
            <Box sx={{ mb: 1 }}>
              {offerObj?.offerCount !== 0 && (
                <p>
                  <strong>{offerObj.offerCount} contract offers</strong> will be affected by this operation.
                </p>
              )}
              <p>
                You are about to enter a legally binding contract agreement for this Contract Offer with provider
                {offerObj ? (
                  <strong style={{ margin: '0 5px' }}>{`${splitWithFirstOcc(offerObj.provider)[0]}.` || '-.'}</strong>
                ) : (
                  '-.'
                )}
              </p>
              <p>Please confirm that</p>
            </Box>
            <p>(1) You are entitled to represent your organization</p>
            <p>(2) You have read and understood the access/usage policy</p>
            <p>(3) Your organization will be responsible to adhere by the rules stated in the access/usage policy.</p>
            <FormControlLabel
              control={<Checkbox checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} name="gilad" />}
              label="I agree"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" disabled={isProgress} onClick={() => handleButton('close')}>
          Cancel
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
