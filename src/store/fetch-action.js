import { modalActions } from "./modal-slice";

export const fetchScheduleData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://calender-dab28-default-rtdb.firebaseio.com/schedule.json"
      );

      if (!response.ok) {
        throw new Error("일정에 관한 데이터를 얻지 못 했습니다!");
      }

      const data = await response.json();
      return data;
    };
    try {
      const scheduleData = await fetchData();
      dispatch(modalActions.fetchFromData(scheduleData));
    } catch (error) {}
  };
};

export const sendScheduleData = (schedule) => {
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        "https://calender-dab28-default-rtdb.firebaseio.com/schedule.json",
        { method: "PUT", body: JSON.stringify(schedule) }
      );

      if (!response.ok) {
        throw new Error("정보를 보내지 못 했습니다.");
      }
    };
    try {
      await sendData();
      dispatch(modalActions.toggleChanged())
    } catch (error) {}
  };
};
