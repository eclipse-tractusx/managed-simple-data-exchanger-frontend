import { Config } from '../utils/config';
import UserService from './UserService';

export const HOST = Config.REACT_APP_API_URL;

export const DEFAULT_HEADERS = {
  Authorization: `Bearer ${UserService.getToken()}`,
};
