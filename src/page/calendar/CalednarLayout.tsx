import { Outlet } from "react-router-dom";
import { useModalStore } from "@/store/useModalStore";
import Header from "@/feature/header/Header";
import MakeEvent from "@/feature/calendar/modal/makeEvent/MakeEvent";

const CalendarLayout = () => {
  const isOpen = useModalStore((state) => state.open);
  
  return (
    <div>
      <Header />
      <Outlet />
      {isOpen && <MakeEvent />}
    </div>
  );
};

export default CalendarLayout;
