import { Route, Routes } from "react-router-dom";

const CalenderPage = () => {
  return <Routes>
    <Route to='/calender' element={<Month/>}/>
  </Routes>
};

export default CalenderPage;
