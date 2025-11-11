import { configureStore } from '@reduxjs/toolkit';

import promotionReducer from './slices/promotionSlice';

export const store = configureStore({
  reducer: {
    promotions: promotionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

