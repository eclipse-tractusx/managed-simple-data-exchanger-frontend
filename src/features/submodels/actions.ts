import { createAsyncThunk } from '@reduxjs/toolkit';
import { schemaValidator } from '../../helpers/SchemaValidator';
import ProviderService from '../../services/ProviderService';
import { setPageLoading } from '../../store/appSlice';
import { setSnackbarMessage } from '../notifiication/slice';

const fetchSubmodelList = createAsyncThunk(`/submodel/list`, async () => {
  try {
    const res = await ProviderService.getInstance().getSubmodelList();
    return res;
  } catch (error) {
    console.log('api call error:', error);
  }
});
const fetchSubmodelDetails = createAsyncThunk(`/submodel/details`, async (params: string, { dispatch }) => {
  try {
    dispatch(setPageLoading(true));
    const res = await ProviderService.getInstance().getSubmodelDetails(params);
    return res;
  } catch (error) {
    console.log('api call error:', error);
  } finally {
    dispatch(setPageLoading(false));
  }
});
const submitJsonData = createAsyncThunk('/submit/json-data', async (data: string, { dispatch }) => {
  try {
    const json = JSON.parse(data.trim());
    if (json) {
      schemaValidator(json);
    }
  } catch (e) {
    dispatch(
      setSnackbarMessage({
        message: 'Invalid data! Enter Required * fields.',
        type: 'error',
      }),
    );
  }
});
export { fetchSubmodelList, fetchSubmodelDetails, submitJsonData };
