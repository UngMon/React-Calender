import { createAsyncThunk } from "@reduxjs/toolkit";
// import { modalActions } from "./data-slice";
import { firebaseConfig } from "../Auth/firebase";
import { UserData } from "../utils/ReduxType";

interface obj {
  data: UserData;
  uid: string;
}

export const getUserData = createAsyncThunk(
  "get/getUesrData",
  async (userId: string) => {
    const response = await fetch(
      `https://${firebaseConfig.databaseURL}/userData/${userId}.json`
    );

    if (!response.ok) {
      throw new Error(
        "일정에 관한 데이터를 얻지 못 했습니다! 다시 시도해주세요."
      );
    }

    const data: UserData = await response.json();
    return data;
  }
);

export const sendUserData = createAsyncThunk(
  "send/sendUserData",
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
