import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../models/User';
interface IAppSlice {
  pageLoading: boolean;
  loggedInUser: IUser;
}
const initialState: IAppSlice = {
  pageLoading: false,
  loggedInUser: {
    userName: '',
    name: '',
    email: '',
    company: '',
    tenant: '',
    token: '',
    parsedToken: {},
  },
};
export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    setLoggedInUser: (state, action: PayloadAction<IUser>) => {
      state.loggedInUser = action.payload;
    },
  },
});

export const { setPageLoading, setLoggedInUser } = appSlice.actions;
export default appSlice.reducer;
