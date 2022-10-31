import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { name: '', email: '' },
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },

    initializeUser(state) {
      state.name = ''
      state.email = ''
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice;
