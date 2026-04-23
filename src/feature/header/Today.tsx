import { Link, useParams } from "react-router-dom";
import { getTodayDateString } from "../../utils/getTodayDateString";
import "./Today.css";

const Today = () => {
  const { view, date } = useParams<{ view: string; date: string }>();

  return (
    <button type="button" className="today">
      <Link to={`/calender/${view}/${getTodayDateString()}`}>
        <span>{new Date().getDate()}</span>
      </Link>
    </button>
  );
};

export default Today;
