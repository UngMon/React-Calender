import { Fragment, useEffect } from "react";
import Header from "./navigation/Header";
import Month from "./calender/Month";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";

function App() {
  const dispatch = useDispatch();

  const modal = useSelector(state => state.modal);

  useEffect(() => {
    dispatch(fetchScheduleData());
    console.log('fetch')
  }, [dispatch]);
  console.log("app렌더링");

  useEffect(() => {
    if (modal.changed) {
      console.log('작동여부');
      dispatch(sendScheduleData(modal.schedule));
    }
  }, [modal, dispatch])

  return (
    <Fragment>
      <Header />
      <Month />
    </Fragment>
  );
}

export default App;
