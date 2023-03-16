import { apiSlice } from '../../app/apiSlice';

export const policiesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    validateBpn: builder.mutation({
      query: bpn => {
        return {
          url: `/unified-bpn-validation/${bpn}`,
        };
      },
    }),
  }),
});

export const { useValidateBpnMutation } = policiesApiSlice;
