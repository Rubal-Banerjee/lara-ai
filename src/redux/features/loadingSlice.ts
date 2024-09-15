import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const loadingSlice = createSlice({
  name: "loadingSlice",
  initialState,
  reducers: {
    setLoading: (_, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
