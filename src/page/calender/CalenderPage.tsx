import { useParams } from "react-router-dom";
import { useModalStore } from "../../store/useModalStore";
import Header from "../../feature/header/Header";
import MonthCalendar from "@/feature/calender/month/MonthCalendar";
import DailyCalender from "../../feature/calender/day/DailyCalender";
import MakeEvent from "../../feature/calender/modal/makeEvent/MakeEvent";

const CalenderPage = () => {
  const { view, date } = useParams();
  const isOpen = useModalStore((state) => state.open);

  return (
    <div>
      <Header />
      {view === "month" && date && <MonthCalendar date={date} />}
      {view === "day" && date && <DailyCalender targetDate={date} />}
      {isOpen && <MakeEvent />}
    </div>
  );
};

export default CalenderPage;
