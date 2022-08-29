import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HOST } from './ApiHelper';
import UserService from './UserService';

abstract class HttpService {
  protected readonly instance: AxiosInstance;

  public constructor(requestConfig: AxiosRequestConfig) {
    this.instance = axios.create(requestConfig);
    this.instance.interceptors.request.use(request => {
      request.baseURL = HOST;
      request.headers.Authorization = `Bearer ${UserService.getToken()}`;
      return request;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) =>
        new Promise((resolve, reject) => {
          reject(error.response);
        }),
    );
  }
}

export default HttpService;
