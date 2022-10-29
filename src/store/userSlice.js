import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: '', name: '', email: '' },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },

    initializeUser(state) {
      state.user = ''
      state.name = ''
      state.email = ''
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice;
