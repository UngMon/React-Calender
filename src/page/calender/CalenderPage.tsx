import { useParams } from "react-router-dom";
import Header from "../../feature/header/Header";
import MonthCalender from "../../feature/calender/MonthCalender";

const CalenderPage = () => {
  const { view, date } = useParams();

  return (
    <div>
      <Header />
      {view === "month" && date && <MonthCalender date={date} />}
    </div>
  );
};

export default CalenderPage;
