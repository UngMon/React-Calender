import { MakeListParameter } from "../type/Etc";
import { UserData } from "../type/ReduxType";
import { makeDateArray } from "./makedateArray";

export const makeList = (parameter: MakeListParameter): UserData => {
  const type = parameter.startDate === parameter.endDate ? "S" : "L";
  const dateObject = JSON.parse(JSON.stringify(parameter.userSchedule));
  const dateArray = makeDateArray(parameter.startDate, parameter.endDate);

  const koreaOffset = 9 * 60 * 60 * 1000; // KST 오프셋 (+09:00) 9시간 추가
  const koreaTime = new Date(Date.now() + koreaOffset).toISOString();

  const key = (
    parameter.startDate +
    type +
    (9999 - dateArray.length) +
    parameter.startTime +
    parameter.endTime +
    koreaTime
  ).replace(/[:. ]/g, "");

  const object = {
    title: parameter.title,
    startDate: parameter.startDate,
    endDate: parameter.endDate,
    startTime: parameter.startTime,
    endTime: parameter.endTime,
    color: parameter.color,
    isDone: false,
    key,
  };

  for (let date of dateArray) {
    if (!dateObject[date]) dateObject[date] = {};
    dateObject[date][key] = object; // O(1)
    dateObject[date] = Object.fromEntries(
      Object.entries(dateObject[date]).sort((a, b) => (a < b ? -1 : 1))
    );
  }

  if (dateObject["dummy"]) delete dateObject["dummy"];

  return dateObject;
};
