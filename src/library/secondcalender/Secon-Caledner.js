
import classes from './second.module.css'
import MakeCaledner from "./Secon-MakeCalender.js.js";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = date.getMonth() + 1;
const fixDate = date.getDate()

const Calender = ({ year, month, firstDay, lastDate }) => {
  const identify = fixYear + '.' + fixMonth + '.' + fixDate;

  return (
    <div className={classes.calender}>
      <table className={classes.table}>
        <thead className={classes.weekname}>
          <tr>
            <th dayindex="1">일</th>
            <th dayindex="2">월</th>
            <th dayindex="3">화</th>
            <th dayindex="4">수</th>
            <th dayindex="5">목</th>
            <th dayindex="6">금</th>
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