import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import promotionReducer from './slices/promotionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    promotions: promotionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
