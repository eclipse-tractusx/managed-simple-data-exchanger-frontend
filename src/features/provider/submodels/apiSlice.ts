import { apiSlice } from '../../app/apiSlice';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHelpData: builder.query<any[], void>({
      query: () => '/submodels/schema-details',
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

export const { useGetHelpDataQuery } = helpApiSlice;
