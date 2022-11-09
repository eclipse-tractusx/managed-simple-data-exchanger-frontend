import { createAsyncThunk } from '@reduxjs/toolkit';
import ProviderService from '../../services/ProviderService';

const fetchSubmodelList = createAsyncThunk(`/submodel/list`, async () => {
  try {
    const res = await ProviderService.getInstance().getSubmodelList();
    return res.data;
  } catch (error: unknown) {
    console.error('api call error:', error);
    throw Error(`fetchSubmodelSchema error`);
  }
});
const fetchSubmodelDetails = createAsyncThunk(`/submodel/details`, async (params: string) => {
  try {
    const res = await ProviderService.getInstance().getSubmodelDetails(params);
    return res;
  } catch (error: unknown) {
    console.error('api call error:', error);
    throw Error(`fetchSubmodelSchema error`);
  }
});

export { fetchSubmodelList, fetchSubmodelDetails };
