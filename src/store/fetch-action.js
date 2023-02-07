import { modalActions } from "./modal-slice";

export const fetchScheduleData = (loginData) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        `https://react-9501f-default-rtdb.firebaseio.com/userData.json`
      );

      if (!response.ok) {
        throw new Error("일정에 관한 데이터를 얻지 못 했습니다! 다시 시도해주세요.");
      }

      const data = await response.json();
      return data;
    };

    try {
      const userData = await fetchData();
      dispatch(modalActions.fetchFromData({userData, loginData}));
    } catch (error) {
      alert(`데이터 불러오지 못 했습니다.`);
    }
  };
};

export const sendScheduleData = (userSchedule, uid) => {
  return async (dispatch) => {
    const sendData = async () => {
      const url = `https://react-9501f-default-rtdb.firebaseio.com/userData/${uid}.json`;

      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(userSchedule),
      });

      if (!response.ok) {
        throw new Error("데이터를 보내지 못 했습니다.");
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
