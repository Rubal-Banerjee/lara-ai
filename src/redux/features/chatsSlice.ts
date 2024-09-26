import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps {
  id: string;
  message: string;
  role: "assistant" | "user" | null;
  createdAt: Date;
  seen: boolean;
}

const initialState: Array<InitialStateProps> = [];

export const chatsSlice = createSlice({
  name: "chatsSlice",
  initialState,
  reducers: {
    setChats: (_, action: PayloadAction<Array<InitialStateProps>>) => {
      return action.payload;
    },
  },
});

export const { setChats } = chatsSlice.actions;
export default chatsSlice.reducer;
