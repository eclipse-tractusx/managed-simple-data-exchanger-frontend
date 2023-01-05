import { apiSlice } from '../../app/apiSlice';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';

export const providerHistorySlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getHistory: builder.query({
      query: params => {
        return {
          url: '/processing-report',
          params,
        };
      },
      providesTags: ['UploadHistory'],
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
    deleteHistory: builder.mutation({
      query: ({ processId, csvType }) => ({
        url: `${csvType}/delete/${processId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UploadHistory'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setPageLoading(true));
        try {
          await queryFulfilled;
          dispatch(setSnackbarMessage({ type: 'success', message: 'Deleted successfully!' }));
        } catch (err) {
          dispatch(setSnackbarMessage({ type: 'error', message: 'Something went wrong!' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetHistoryQuery, useDeleteHistoryMutation } = providerHistorySlice;
