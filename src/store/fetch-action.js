import { modalActions } from "./modal-slice";

export const fetchScheduleData = (user) => {

  return async (dispatch) => {
    console.log("fetch?");
    const fetchData = async () => {
      console.log("여기는?");
      const response = await fetch(
        "https://react-9501f-default-rtdb.firebaseio.com/userData.json"
      );

      if (!response.ok) {
        console.log("오류발생?");
        throw new Error("일정에 관한 데이터를 얻지 못 했습니다!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const userData = await fetchData();
      console.log(userData);
      dispatch(modalActions.fetchFromData(userData));
      if (user) {
        console.log(user)
        console.log('작동?')
        const email = user.email
        dispatch(modalActions.confirmUser({email}));
      }
    } catch (error) {
      console.log(error);
      alert("데이터 불러오기 실패");
      throw new Error(error);
    }
  };
};

export const sendScheduleData = (userData) => {
  console.log("send");
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        "https://react-9501f-default-rtdb.firebaseio.com/userData.json",
        { method: "PUT", body: JSON.stringify(userData) }
      );

      if (!response.ok) {
        throw new Error("정보를 보내지 못 했습니다.");
      }
    };
    try {
      await sendData();
      dispatch(modalActions.toggleChanged());
    } catch (error) {
      alert("데이터 전송 실패");
      throw new Error(error);
    }
  };
};
