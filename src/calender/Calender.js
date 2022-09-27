import { useSelector } from "react-redux";
import AddEvent from "../modal/AddEvent";
import List from "../modal/List";
import AllList from '../modal/AllList';
import classes from "./Calender.module.css";
import MakeCaledner from "./MakeCalender";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = date.getMonth();
const fixDate = date.getDate()

const Calender = ({ year, month, firstDay, lastDate }) => {
  const addModal = useSelector((state) => state.modal);
  const listModal = useSelector((state) => state.list);
  const allListModal = useSelector((state) => state.all);
  const identify = fixYear + '.' + fixMonth + '.' + fixDate;

  return (
    <div className={classes.calender}>
      {addModal.isVisible && <AddEvent />}
      {listModal.isVisible && <List />}
      {allListModal.isVisible && <AllList />}
      <table className={classes.table}>
        <thead className={classes.weekname}>
          <tr>
            <th dayindex="0">일</th>
            <th dayindex="1">월</th>
            <th dayindex="2">화</th>
            <th dayindex="3">수</th>
            <th dayindex="4">목</th>
            <th dayindex="5">금</th>
            <th dayindex="7">토</th>
          </tr>
        </thead>
        <tbody className={classes.presentation}>
          {MakeCaledner({ year, month, firstDay, lastDate, identify })}
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
