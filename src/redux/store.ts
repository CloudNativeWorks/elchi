import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers/reducers";
// import protobufMiddleware from "./middleware";

const store = configureStore({
    reducer: Reducer,
    devTools: !import.meta.env.PROD, // devTools enabled in non-production environments
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(protobufMiddleware),
    // devTools: false
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
