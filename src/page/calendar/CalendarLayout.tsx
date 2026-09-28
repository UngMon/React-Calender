import { Outlet } from "react-router-dom";
import Header from "@/feature/header/Header";
import ModalLayout from "@/feature/calendar/modal/ModalLayout";

const CalendarLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <ModalLayout/>
    </div>
  );
};

export default CalendarLayout;
