import { useSelector } from "react-redux";
import AddEvent from "../modal/AddEvent";
import List from "../modal/List";
import classes from "./Calender.module.css";
import MakeCaledner from "./MakeCalender";

const Calender = ({ year, month, firstDay, lastDate }) => {
  const addModal = useSelector((state) => state.modal);
  const listModal = useSelector((state) => state.list);

  return (
    <div className={classes.calender}>
      {addModal.isVisible && <AddEvent />}
      {listModal.isVisible && <List />}
      <table className={classes.table}>
        <thead className={classes.weekname}>
          <tr>
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
        </thead>
        <tbody className={classes.presentation}>
          {MakeCaledner({ year, month, firstDay, lastDate })}
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
