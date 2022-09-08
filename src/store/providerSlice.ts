import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CsvTypes, ProcessReport, Status } from '../models/ProcessReport';

interface IProviderSlice {
  currentUploadData: ProcessReport;
  uploadStatus: boolean;
  selectedFiles: File[];
}

const initialState: IProviderSlice = {
  currentUploadData: {
    processId: '',
    csvType: CsvTypes.unknown,
    numberOfItems: 0,
    numberOfFailedItems: 0,
    numberOfSucceededItems: 0,
    status: Status.inProgress,
    startDate: '',
    endDate: undefined,
  },
  uploadStatus: false,
  selectedFiles: [],
};
export const providerSlice = createSlice({
  name: 'providerSlice',
  initialState,
  reducers: {
    setUploadData: (state, action: PayloadAction<ProcessReport>) => {
      state.currentUploadData = action.payload;
    },

    setUploadStatus: (state, action: PayloadAction<boolean>) => {
      state.uploadStatus = action.payload;
    },
    setSelectedFiles: (state, action: PayloadAction<File[]>) => {
      state.selectedFiles = action.payload;
    },
    removeSelectedFiles: state => {
      state.selectedFiles = [];
      state.uploadStatus = false;
    },
  },
});

export const { setUploadData, setSelectedFiles, setUploadStatus, removeSelectedFiles } = providerSlice.actions;
export default providerSlice.reducer;
