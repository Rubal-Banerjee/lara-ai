import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string | undefined = "";

export const chatRoomSlice = createSlice({
  name: "chatRoomSlice",
  initialState,
  reducers: {
    setChatRoom: (_, action: PayloadAction<string | undefined>) => {
      return action.payload;
    },
  },
});

export const { setChatRoom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
