import { combineReducers } from "redux";
import { dataReducer } from "./data-slice";
import { timeReducer } from "./time-slice";
import { modalReducer } from "./modal-slice";

const rootReducer = combineReducers({
  data: dataReducer,
  modal: modalReducer,
  time: timeReducer,
});

export default rootReducer;
