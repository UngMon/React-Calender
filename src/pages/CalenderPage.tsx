import { Route, Routes } from "react-router-dom";
import Month from "../calender/Month";

const CalenderPage = () => {
  return <Routes>
    <Route to='/calender' element={<Month/>}/>
  </Routes>
};

export default CalenderPage;
