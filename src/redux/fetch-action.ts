import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseConfig } from "../Auth/firebase";
import { CalenderData, Fetch, UserData } from "../type/ReduxType";
import { getDatabase, ref, child, push, update } from "firebase/database";

interface Obj {
  newSchedule: UserData;
  uid: string;
  type: string;
}

export const getUserData = createAsyncThunk("get", async (userId: string) => {
  const response = await fetch(
    `https://${firebaseConfig.databaseURL}/userData/${userId}.json`
  );

  const data: Fetch = await response.json();
  return data;
});

export const sendUserData = createAsyncThunk("send", async (object: Obj) => {
  const db = getDatabase();

  try {
    const updates: any = {};
    updates[`/userData/${object.uid}/schedule`] = object.newSchedule;
    update(ref(db), updates);
  } catch (error) {
    console.log(error)
    throw new Error("");
  }

  const { newSchedule, uid, type } = object;
  return { newSchedule, uid, type };
});
