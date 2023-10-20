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
  isLogin: boolean;
  isLoading: boolean;
  isCreated: boolean;
  isSending: boolean;
  succesGetData: boolean;
  succesSendData: boolean;
  dataChanged: boolean;
  userSchedule: UserData;
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
  click: string;

}

export interface ModalType extends ModalBasicType {
  addModalOpen: boolean,
  listModalOpen: boolean,
  moreModalOpen: boolean,
  mobileModalOpen: boolean,
  openEdit: boolean;
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
