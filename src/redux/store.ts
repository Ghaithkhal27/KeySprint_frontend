import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import gameSlice from "./gameSlice";
import userSlice from "./userSlice";
import typingTestSlice from "./typingTestSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    game:gameSlice,
    user:userSlice,
    typing:typingTestSlice,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
