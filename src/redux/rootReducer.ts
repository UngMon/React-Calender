import { combineReducers } from "redux";
import { dataReducer } from "./data-slice";
import { modalReducer } from "./modal-slice";
import { dateReducer } from "./date-slice";
import { cloneReducer } from "./clone-slice";

const rootReducer = combineReducers({
  data: dataReducer,
  date: dateReducer,
  modal: modalReducer,
  clone: cloneReducer,
});

export default rootReducer;
