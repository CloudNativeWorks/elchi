import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers/reducers";
// import protobufMiddleware from "./middleware";

if ((!import.meta.env.DEV || process.env.NODE_ENV === 'live') && typeof window !== 'undefined') {
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

// console.log('Redux DevTools durumu:', {
//     NODE_ENV: process.env.NODE_ENV,
//     PROD: import.meta.env.PROD,
//     DEV: import.meta.env.DEV,
//     MODE: import.meta.env.MODE,
//     devToolsEnabled: import.meta.env.DEV && process.env.NODE_ENV !== 'live'
// });

const store = configureStore({
    reducer: Reducer,
    devTools: import.meta.env.DEV && process.env.NODE_ENV !== 'live',
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(protobufMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
