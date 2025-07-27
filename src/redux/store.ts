import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers/reducers";
// import protobufMiddleware from "./middleware";

// Redux DevTools sadece development ortamında aktif
const isDevelopment = process.env.NODE_ENV === 'development' &&
    import.meta.env.DEV &&
    !import.meta.env.PROD;

// Production'da Redux DevTools extension'ını da devre dışı bırak
if (!isDevelopment && typeof window !== 'undefined') {
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

console.log('Redux DevTools durumu:', {
    isDevelopment,
    NODE_ENV: process.env.NODE_ENV,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV
});

const store = configureStore({
    reducer: Reducer,
    devTools: isDevelopment,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(protobufMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
