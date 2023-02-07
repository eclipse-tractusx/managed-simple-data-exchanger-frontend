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
          dispatch(setSnackbarMessage({ type: 'success', message: 'alerts.deleteSuccess' }));
        } catch (err) {
          dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.somethingWrong' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetHistoryQuery, useDeleteHistoryMutation } = providerHistorySlice;
