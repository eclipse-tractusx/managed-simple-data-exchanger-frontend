import { AlertColor } from '@mui/material/Alert';

export interface INotificationSlice {
  openSnackBar: boolean;
  snackBarMessage: string;
  snackbarType: AlertColor;
}
export interface IActionPayload {
  message: string;
  type: AlertColor;
}
