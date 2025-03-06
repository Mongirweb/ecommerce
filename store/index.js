import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import cart from "./cartSlice";
import expandSidebar from "./ExpandSlice";
import dialog from "./DialogSlice";
import dialogCreateProduct from "./createProductDialogSlice";
import userVisitedProducts from "./visitedItemsSlice";
import infiniteScrollReducer from "./infiniteScrollSlice";

// Configuration for redux-persist
const persistConfig = {
  key: "root", // key to store in localStorage
  storage, // define storage type
  whitelist: ["cart", "expandSidebar", "userVisitedProducts"],
};

// Combine your reducers
const rootReducer = combineReducers({
  cart,
  userVisitedProducts,
  expandSidebar,
  dialog,
  dialogCreateProduct,
  infiniteScroll: infiniteScrollReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist actions
    }),
});

// Create the persistor to be used in the PersistGate
export const persistor = persistStore(store);
