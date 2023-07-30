import { combineReducers } from "redux";
import { dataReducer } from "./data-slice";
import { monthReducer } from "./month-slice";
import { moreReducer } from "./more-slice";
import { listReducer } from "./list-slice";
import { timeReducer } from "./time-slice";

const rootReducer = combineReducers({
  month: monthReducer,
  data: dataReducer,
  list: listReducer,
  more: moreReducer,
  time: timeReducer,
});

export default rootReducer;
