import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConsumerDataOffers } from '../models/ConsumerContractOffers';

interface IConsumerSlice {
  offersLoading: boolean;
  contractOffers: IConsumerDataOffers[];
  selectedOffer: IConsumerDataOffers;
}

const initialState: IConsumerSlice = {
  offersLoading: false,
  contractOffers: [],
  selectedOffer: null,
};
export const consumerSlice = createSlice({
  name: 'consumerSlice',
  initialState,
  reducers: {
    setOffersLoading: (state, action: PayloadAction<boolean>) => {
      state.offersLoading = action.payload;
    },
    setContractOffers: (state, action: PayloadAction<IConsumerDataOffers[]>) => {
      state.contractOffers = action.payload;
    },
    setSelectedOffer: (state, action: PayloadAction<IConsumerDataOffers>) => {
      state.selectedOffer = action.payload;
    },
  },
});

export const { setOffersLoading, setContractOffers, setSelectedOffer } = consumerSlice.actions;
export default consumerSlice.reducer;
