import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "@/redux/features/loadingSlice";
import authReducer from "@/redux/features/authStepSlice";
import realtimeReducer from "@/redux/features/realtimeSlice";
import chatRoomReducer from "@/redux/features/chatRoomSlice";
import chatsReducer from "@/redux/features/chatsSlice";

export const makeStore = () => {
  return configureStore(
    {
      reducer: {
        loadingReducer,
        authReducer,
        realtimeReducer,
        chatRoomReducer,
        chatsReducer,
      },
    }
    // devTools: process.env.NODE_ENV !== "production",
  );
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
