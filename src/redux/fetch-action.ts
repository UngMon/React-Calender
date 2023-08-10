import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseConfig } from "../Auth/firebase";
import { UserData } from "../utils/ReduxType";

interface obj {
  data: UserData;
  uid: string;
}

export const getUserData = createAsyncThunk("get", async (userId: string) => {
  console.log(`https://${firebaseConfig.databaseURL}/userData/${userId}.json`)
  const response = await fetch(
    `https://${firebaseConfig.databaseURL}/userData/${userId}.json`
  );

  const data: UserData = await response.json();
  return data;
});

export const sendUserData = createAsyncThunk(
  "send",
  async (object: obj) => {
    const url = `https://${firebaseConfig.databaseURL}/userData/${object.uid}.json`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(object.data),
    });

    if (!response.ok) {
      throw new Error("데이터를 보내지 못 했습니다.");
    }
  }
);
