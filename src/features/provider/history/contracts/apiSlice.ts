import { apiSlice } from '../../../app/apiSlice';
import { setPageLoading } from '../../../app/slice';
import { setSnackbarMessage } from '../../../notifiication/slice';

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getContracts: builder.query({
      query: params => {
        return {
          url: '/contract-agreements',
          params,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        dispatch(setPageLoading(true));
        try {
          await queryFulfilled;
          // `onSuccess` side-effect
        } catch (err) {
          // `onError` side-effect
          dispatch(setSnackbarMessage({ type: 'error', message: 'Something went wrong!' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetContractsQuery } = contractsSlice;
