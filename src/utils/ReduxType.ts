export interface CalenderData {
  title: string;
  color: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isDone: boolean;
  key: string;
}

export interface UserData {
  [key: string]: CalenderData;
}

export interface DataType {
  addModalOpen: boolean;
  isLogin: boolean;
  isLoading: boolean;
  isCreated: boolean;
  startDate: string;
  endDate: string;
  week: string;
  day: string;
  dataChanged: boolean;
  userSchedule: { [key: string]: CalenderData };
  dateArray: string[];
}

//////
////// more slice
//////

export interface MoreType {
  isVisible: boolean;
  date: string;
  day: string;
  week: string;
  key: string;
}
