import Snackbar from '@mui/material/Snackbar';
import { SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleSnackbar } from './slice';

export default function Notification() {
  const { openSnackBar, snackBarMessage, snackbarType } = useAppSelector(state => state.notification);
  const dispatch = useAppDispatch();

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(toggleSnackbar());
  };

  return (
    <div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={snackbarType} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
