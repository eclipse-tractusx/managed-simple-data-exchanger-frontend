import { configureStore } from '@reduxjs/toolkit';
import accessUsagePolicySlice from './accessUsagePolicySlice';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import providerSlice from './providerSlice';
import consumerSlice from './consumerSlice';
import appSlice from './appSlice';

export const store = configureStore({
  reducer: {
    appSlice: appSlice,
    accessUsagePolicySlice: accessUsagePolicySlice,
    providerSlice: providerSlice,
    consumerSlice: consumerSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
