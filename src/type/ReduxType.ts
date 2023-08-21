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
  [key: string]: { [key: string]: CalenderData };
}

export interface DataType {
  addModalOpen: boolean;
  isLogin: boolean;
  isLoading: boolean;
  isCreated: boolean;
  isSending: boolean;
  succesGetData: boolean;
  succesSendData: boolean;
  startDate: string;
  endDate: string;
  week: string;
  day: string;
  dataChanged: boolean;
  userSchedule: UserData;
  dateArray: string[];
}

////// more slice //////

export interface MoreType {
  isVisible: boolean;
  date: string;
  day: string;
  week: string;
  key: string;
}

////////////// Modal Type ////////////

export interface ModalType {
  listModalOpen: boolean;
  moreModalOpen: boolean;
  isDone: boolean;
  date: string;
  week: string;
  day: string;
  color: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  key: string;
  index: number;
  mouseType: string;
}

///// time /////
export interface Time {
  firstIsVisible: boolean;
  lastIsVisible: boolean;
  firstTime: string;
  lastTime: string;
}

//// fetch ////

export interface Fetch {
  email: string;
  name: string;
  schedule: UserData;
}
