import _ from 'lodash';

import { apiSlice } from '../../app/apiSlice';
import { setPageLoading } from '../../app/slice';
import { setSnackbarMessage } from '../../notifiication/slice';

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHelpPageData: builder.query({
      query: params => {
        return {
          url: '/submodels/schema-details',
          params,
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]) => {
        const pageData = response.map(submodel => {
          return {
            name: submodel.title,
            description: submodel.description,
            id: submodel.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rows: Object.entries(submodel.items.properties).map(([key, value]: any, index) => ({
              id: index,
              name: key,
              mandatory: _.indexOf(submodel.items.required, key) > -1 ? 'true' : 'false',
              order: index + 1,
              description: value.description,
            })),
          };
        });
        return pageData;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setPageLoading(true));
        try {
          await queryFulfilled;
        } catch (err) {
          dispatch(setSnackbarMessage({ type: 'error', message: 'Something went wrong!' }));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useGetHelpPageDataQuery } = helpApiSlice;
