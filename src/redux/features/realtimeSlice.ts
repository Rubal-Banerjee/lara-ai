import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const realtimeSlice = createSlice({
  name: "realtimeSlice",
  initialState,
  reducers: {
    setRealtime: (_, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setRealtime } = realtimeSlice.actions;
export default realtimeSlice.reducer;
