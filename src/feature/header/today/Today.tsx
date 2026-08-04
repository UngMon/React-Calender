import { Link, useLocation, useParams } from "react-router-dom";
import { getYMDString } from "@/utils/getTodayString";
import "./Today.css";

const Today = () => {
  const viewMode: string = useLocation().pathname.split("/")[2];
  const condition: string = viewMode[0].toUpperCase();

  return (
    <button type="button" className="today">
      <Link to={`/calendar/${viewMode}/${getYMDString(condition)}`}>
        <span>{new Date().getDate()}</span>
      </Link>
    </button>
  );
};

export default Today;
