import { useParams } from "react-router-dom";
import Header from "../../feature/header/Header";
import MonthCalender from "../../feature/calender/month/MonthCalender";
import DailyCalender from "../../feature/calender/day/DailyCalender";

const CalenderPage = () => {
  const { view, date } = useParams();
  console.log(date)
  return (
    <div>
      <Header />
      {view === "month" && date && <MonthCalender date={date} />}
      {view === "day" && date && <DailyCalender targetDate={date} />}
    </div>
  );
};

export default CalenderPage;
