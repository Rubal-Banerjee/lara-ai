import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 1;

export const authStepSlice = createSlice({
  name: "authStepSlice",
  initialState,
  reducers: {
    setAuthStep: (_, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setAuthStep } = authStepSlice.actions;
export default authStepSlice.reducer;
