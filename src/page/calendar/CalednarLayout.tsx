import { Outlet } from "react-router-dom";
import Header from "@/feature/header/Header";
import MakeEventLayout from "@/feature/calendar/modal/makeEvent/MakeEvent";

const CalendarLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <MakeEventLayout />
    </div>
  );
};

export default CalendarLayout;
