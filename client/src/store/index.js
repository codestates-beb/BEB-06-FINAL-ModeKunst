import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import userReducer from "./user";
import selectedSectionReducer from "./selectedSection";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["user", "selectedSection"],
};

const rootReducer = combineReducers({
  user: userReducer,
  selectedSection: selectedSectionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

//configureStore을 사용하면 기본 미들웨어로 redux-thunk를 추가하고
//개발환경에서 리덕스 개발자 도구(Redux DevTools Extention)를 활성화해줌
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
