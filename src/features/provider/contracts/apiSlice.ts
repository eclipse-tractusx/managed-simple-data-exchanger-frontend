import { apiSlice } from '../../app/apiSlice';

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getContracts: builder.query({
      query: params => {
        return {
          url: '/contract-agreements',
          params,
        };
      },
    }),
  }),
});

export const { useGetContractsQuery } = contractsSlice;
