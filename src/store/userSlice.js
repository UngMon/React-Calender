import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {},
});

export const userActions = userSlice.actions;

export default userSlice;
