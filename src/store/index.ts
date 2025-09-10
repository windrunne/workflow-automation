import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: any) => {
          if (value instanceof Date) {
            return true;
          }

          return typeof value !== 'object' || value === null || Array.isArray(value) || 
                 Object.prototype.toString.call(value) === '[object Object]';
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
