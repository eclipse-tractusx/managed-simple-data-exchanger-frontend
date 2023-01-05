import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from '../../services/RequestService';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery(apiBaseQuery()),
  endpoints: () => ({}),
  tagTypes:['UploadHistory'],
});
