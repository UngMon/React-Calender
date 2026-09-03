import MonthCalendar from "@/feature/calendar/month/MonthCalendar";
import { useCalendarWheelNav } from "@/hooks/useCalendarWheelNav";
import { useParams } from "react-router-dom";

const MonthCalendarPage = () => {
  const { year, month } = useParams();
  const view = "month" as const;
  const currentDateStr = `${year}-${month}`;

  const { handleWheel } = useCalendarWheelNav({ view, currentDateStr });

  return (
    <div onWheel={handleWheel}>
      <MonthCalendar year={year!} month={month!} />
    </div>
  );
};

export default MonthCalendarPage;
