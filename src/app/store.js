import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { weatherApi } from "../api/weatherApi";
import preferenceReducer from "../features/preferences/preferenceSlice"
import { locationApi } from "../api/locationApi";
import { airQualityApi } from "../api/airQuality";
const storage = {
  getItem: (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },

  setItem: (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },

  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const rootReducer = combineReducers({
  [weatherApi.reducerPath]: weatherApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [airQualityApi.reducerPath]: airQualityApi.reducer,

  preference: preferenceReducer,
  
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(weatherApi.middleware)
    .concat(locationApi.middleware)
    .concat(airQualityApi.middleware)
});

export const persistor = persistStore(store);

export default store