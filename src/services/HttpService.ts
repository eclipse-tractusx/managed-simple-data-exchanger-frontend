import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { toastProps } from '../helpers/ToastOptions';
import { setLoggedInUser } from '../store/appSlice';
import { store } from '../store/store';
import { HOST } from './ApiHelper';
import UserService from './UserService';

abstract class HttpService {
  protected readonly instance: AxiosInstance;

  public constructor(requestConfig: AxiosRequestConfig) {
    this.instance = axios.create(requestConfig);

    this.instance.interceptors.request.use(request => {
      request.baseURL = HOST;
      if (UserService.isLoggedIn()) {
        const cb = () => {
          store.dispatch(setLoggedInUser(UserService.getLoggedUser()));
          request.headers.Authorization = `Bearer ${UserService.getToken()}`;
          return Promise.resolve(request);
        };
        return UserService.updateToken(cb);
      }
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) =>
        new Promise(reject => {
          toast.error('Something went wrong!', toastProps());
          reject(error.response);
        }),
    );
  }
}

export default HttpService;
