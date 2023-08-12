import { UserData } from "./ReduxType";

export interface MakeListParameter {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
  dateArray: string[];
  userSchedule: UserData;
}

