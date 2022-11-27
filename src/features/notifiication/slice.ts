import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IActionPayload, INotificationSlice } from './types';

export const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState: {
    openSnackBar: false,
    snackBarMessage: '',
    snackbarType: 'success',
  } as INotificationSlice,
  reducers: {
    toggleSnackbar: state => {
      state.openSnackBar = !state.openSnackBar;
    },
    setSnackbarMessage: (state, action: PayloadAction<IActionPayload>) => {
      state.snackbarType = action.payload.type;
      state.snackBarMessage = action.payload.message;
      state.openSnackBar = true;
    },
  },
});

export const { toggleSnackbar, setSnackbarMessage } = notificationSlice.actions;

export default notificationSlice.reducer;
