import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { combineReducers } from "redux";
import campaignReducer from "./slices/campaignSlice";
import daoMembersReducer from "./slices/daoMembersSlice";
import proposalsListReducer from "./slices/proposalsListSlice";

// import betsReducer from "./slices/betsSlice.js";
// import stakedEventsReducer from "./slices/userStakesSlice.js";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  campaigns: campaignReducer,
  daoMembers: daoMembersReducer,
  proposalsList: proposalsListReducer,
//   bets: betsReducer,
//   stakedEvents: stakedEventsReducer, // ✅ Add the slice here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization
    }),
});

export const persistor = persistStore(store);
