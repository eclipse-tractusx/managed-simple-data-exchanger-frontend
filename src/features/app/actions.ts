import { createAsyncThunk } from '@reduxjs/toolkit';
import AppService from '../../services/appService';

const fetchUserPermissions = createAsyncThunk(`/user/permissions`, async () => {
  try {
    const res = await AppService.getInstance().getUserPermissions();
    return res.data;
  } catch (error) {
    console.log('api call error:', error);
  }
});

export { fetchUserPermissions };
