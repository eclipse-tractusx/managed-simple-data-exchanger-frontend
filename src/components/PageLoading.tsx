import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../store/store';

export default function PageLoading() {
  const { pageLoading } = useAppSelector(state => state.appSlice);
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 200, flexDirection: 'column' }} open={pageLoading}>
      <CircularProgress color="inherit" />
      <Typography mt={4}>Uploading...</Typography>
    </Backdrop>
  );
}
