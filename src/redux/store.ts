import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers/reducers";
// import protobufMiddleware from "./middleware";

// Redux DevTools sadece development ortamında aktif
// 'live' environment'ı da production olarak kabul et
const isProductionEnvironment = process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'live' ||
    import.meta.env.PROD;

const isDevelopment = process.env.NODE_ENV === 'development' && !isProductionEnvironment;

// Production'da Redux DevTools extension'ını da devre dışı bırak
if (isProductionEnvironment && typeof window !== 'undefined') {
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

console.log('Redux DevTools durumu:', {
    isDevelopment,
    isProductionEnvironment,
    NODE_ENV: process.env.NODE_ENV,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    devToolsEnabled: process.env.NODE_ENV === 'development'
});

const store = configureStore({
    reducer: Reducer,
    devTools: process.env.NODE_ENV === 'development' ? true : false,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(protobufMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
