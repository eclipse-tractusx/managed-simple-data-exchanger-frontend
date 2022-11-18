import { GridValidRowModel } from '@mui/x-data-grid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { schemaValidator } from '../../helpers/SchemaValidator';
import ProviderService from '../../services/ProviderService';

const fetchSubmodelList = createAsyncThunk(`/submodel/list`, async () => {
  try {
    const res = await ProviderService.getInstance().getSubmodelList();
    return res;
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

const submitJsonData = createAsyncThunk('submit/json-data', async (data: GridValidRowModel[]) => {
  console.log('inside');
  const res = await schemaValidator(data);
  return res;
});

export { fetchSubmodelList, fetchSubmodelDetails, submitJsonData };
