import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseConfig } from "../Auth/firebase";
import { Fetch, HoliDay, UserData } from "../type/ReduxType";
import { getDatabase, ref, update } from "firebase/database";

interface Obj {
  newSchedule: UserData;
  uid: string;
  type: string;
}

// interface HoliParam {
//   year: string;
//   holiday: { [key: string]: HoliDay };
// }

export const getNationalDay = createAsyncThunk(
  "holiday",
  async (year: string) => {
    // 한국천문연구원 url 만들기
    const serviceKey: string = process.env.REACT_APP_NationalDay_API_Key!;
    const domain =
      "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=";
    const url: string =
      domain + `${serviceKey}&_type=json&numOfRows=100&solYear=`;

    // 사용자가 보고 있는 년도 기준으로 배열 만들기 ex) 2023 => 2022, 2024까지
    let yearArray = [];

    // 아래 병렬 API 통신을 위한 배열
    let requests: Promise<Response>[] = [];

    // for문에서 현재 세션스토리지에 저장된 해당 년도의 국경일이 있는지 확인하기
    for (let i = +year - 1; i <= +year + 1; i++) {
      // 해당 국경일 데이터가 없는 경우 => ex)캘린더의 다음 년도를 보고 있는 경우
      const y = String(i);
      if (sessionStorage.getItem(y)) continue;
      requests.push(fetch(url + y));
      yearArray.push(y);
    }

    // redux extraReducers에 전달한 data배열 만들기
    let data: any[] = [];

    try {
      // 앞서 requests(해당 년도의 국경일이 세션스토리지에 없는 fetch(url))을 병렬처리
      const responses = await Promise.all(requests);

      // api status: 200 성공적으로 데이터를 불러오면 json()메소드를 이용해서
      // 데이터를 가공할 수 있는 상태로 만들기
      data = await Promise.all(
        responses.map((response) => {
          if (!response.ok) throw new Error(`Network Error ${response.status}`);
          return response.json();
        })
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    // extraReducers에 전달될 object => action obejct로 전달
    return { year, data, yearArray };
  }
);

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
    console.log(error);
    throw new Error("");
  }

  const { newSchedule, uid, type } = object;
  return { newSchedule, uid, type };
});
