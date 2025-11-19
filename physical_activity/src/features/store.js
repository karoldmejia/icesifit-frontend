import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";

const rootReducer = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(
    {
        key: "root",
        storage,
    },
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
