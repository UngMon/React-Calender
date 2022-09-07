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
      console.log(data);
      return data;
    };
    try {
      const scheduleData = await fetchData();
      dispatch(modalActions.inputList(scheduleData));
    } catch (error) {}
  };
};
