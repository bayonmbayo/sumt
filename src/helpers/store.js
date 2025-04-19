import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import loggerMiddleware from './logger';
import monitorReducerEnhancer from './monitorReducer';

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware),
    enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers().concat(monitorReducerEnhancer),
    devTools: process.env.NODE_ENV !== 'production', // Redux DevTools enabled by default in development
    preloadedState: {} // optional initial state
});