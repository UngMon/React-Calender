export interface HoliDay {
  [key: string]: { isHoliday: string; dateName: string };
}

export interface UserData {
  [key: string]: { [key: string]: CalenderData };
}

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

export interface DataType {
  isLogin: boolean;
  isLoading: boolean;
  isCreated: boolean;
  isSending: boolean;
  succesGetNationalDayData: boolean;
  succesGetScheduleData: boolean;
  succesSendScheduleData: boolean;
  dataChanged: boolean;
  userSchedule: UserData;
  holiday: { [key: string]: HoliDay };
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

export interface ModalBasicType {
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

export interface ModalType extends ModalBasicType {
  addModalOpen: boolean;
  listModalOpen: boolean;
  moreModalOpen: boolean;
  mobileModalOpen: boolean;
  openEdit: boolean;
}

///// time /////
export interface Time {
  firstIsVisible: boolean;
  lastIsVisible: boolean;
  startTime: string;
  endTime: string;
}

//// fetch ////

export interface Fetch {
  email: string;
  name: string;
  schedule: UserData;
}
