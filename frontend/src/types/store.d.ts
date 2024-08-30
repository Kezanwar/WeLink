import { store } from '@app/store/store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type GetState = typeof store.getState;
