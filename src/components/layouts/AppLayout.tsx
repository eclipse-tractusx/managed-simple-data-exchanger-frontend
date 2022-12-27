import { Box } from '@mui/material';
import { useEffect } from 'react';

import { fetchUserPermissions } from '../../features/app/actions';
import { setLoggedInUser } from '../../features/app/slice';
import { useAppDispatch } from '../../store/store';
import Nav from '../Nav';
import Sidebar from '../Sidebar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AppLayout(props: any) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserPermissions());
    dispatch(setLoggedInUser(props.loggedUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ my: 0, mx: 'auto', overflowY: 'auto', overflowX: 'hidden', height: '100vh' }}>
      <Box>
        <Nav />
        <Box sx={{ display: 'flex', mt: 8, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
