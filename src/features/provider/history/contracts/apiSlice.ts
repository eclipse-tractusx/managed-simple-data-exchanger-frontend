import { apiSlice } from '../../../app/apiSlice';
import { setPageLoading } from '../../../app/slice';
import { IContractAgreements } from '../../../consumer/types';
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
      transformResponse: async ({ connector, contracts }) => { 
        const modifieldData = contracts
          .sort(
            (contract1: IContractAgreements, contract2: IContractAgreements) =>
              contract2.dateCreated - contract1.dateCreated,
          )
          .map((item: IContractAgreements, index: number) => {
            return { ...{ id: index, ...item  } };
          });
        return { connector, contracts: modifieldData };
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
