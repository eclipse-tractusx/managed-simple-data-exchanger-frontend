import { IUser } from '../../models/User';

export interface IAppSlice {
  pageLoading: boolean;
  loggedInUser: IUser;
  isUserValid: boolean;
  permissions: string[];
}
