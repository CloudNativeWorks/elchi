import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers/reducers";
// import protobufMiddleware from "./middleware";

// Production'da Redux DevTools extension'ını da devre dışı bırak
if (!import.meta.env.DEV && typeof window !== 'undefined') {
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

console.log('Redux DevTools durumu:', {
    NODE_ENV: process.env.NODE_ENV,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    devToolsEnabled: import.meta.env.DEV
});

const store = configureStore({
    reducer: Reducer,
    devTools: import.meta.env.DEV,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(protobufMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
