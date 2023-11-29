import { configureStore } from "@reduxjs/toolkit";
import blockSlice from "@/redux/blockSlice";

const store = configureStore({
  reducer: {
    blocks: blockSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
