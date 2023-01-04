import { apiSlice } from '../app/apiSlice';

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHelpData: builder.query<any[], void>({
      query: () => '/submodels/schema-details',
    }),
  }),
});

export const { useGetHelpDataQuery } = helpApiSlice; 