import MonthCalendar from "@/feature/calendar/month/MonthCalendar";
import { useParams } from "react-router-dom";

const MonthCalendarPage = () => {
  const { year, month } = useParams();
  return (
    <div>
      <MonthCalendar date={`${year}-${month}`} />
    </div>
  );
};

export default MonthCalendarPage;
