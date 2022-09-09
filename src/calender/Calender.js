import { useSelector } from "react-redux";
import AddEvent from "./AddEvent";
import classes from "./Calender.module.css";
import MakeCaledner from "./MakeCalender";

const Calender = ({ year, month, firstDay, lastDate }) => {
  const addModal = useSelector((state) => state.modal);

  return (
    <div className={classes.calender}>
      {addModal.isVisible && (
        <AddEvent/>
      )}
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
// let thisDates = []; //div태그 생성을 위한 날짜 배열 생성
// let differenceDay = 0;

// if (props.prevDay === 0) {
//   thisDates.push(props.prevDate);

//   for (let i = 1; i <= props.lastDateOfThisMonth; i++) {
//     thisDates.push(i);
//   }

//   differenceDay = 35 - thisDates.length;

//   if (differenceDay > 0) {
//     for (let j = 1; j < differenceDay + 1; j++) {
//       thisDates.push(j);
//     }
//   }
// } else if (props.prevDay === 6) {
//   for (let i = 1; i < props.lastDateOfThisMonth + 1; i++) {
//     thisDates.push(i);
//   }
//   differenceDay = 35 - thisDates.length;
//   for (let j = 1; j < differenceDay + 1; j++) {
//     thisDates.push(j);
//   }
// } else {
//   for (let i = props.prevDate - props.prevDay; i < props.prevDate + 1; i++) {
//     thisDates.push(i);
//   }
//   for (let j = 1; j < props.lastDateOfThisMonth + 1; j++) {
//     thisDates.push(j);
//   }
//   if (thisDates.length > 35) {
//     differenceDay = 42 - thisDates.length;
//   } else {
//     differenceDay = 35 - thisDates.length;
//   }
//   if (differenceDay > 0) {
//     for (let k = 1; k < differenceDay + 1; k++) {
//       thisDates.push(k);
//     }
//   }
// }
// console.log(thisDates);

// const dateClickHandler = (index) => {
//   dispatch(modalActions.toggle(index));
// };

// const thisDateLength = thisDates.length / 7;

// <div className={thisDateLength === 6 ? "week-six" : "week-fifth"}>
// {thisDates.map((date, idx) => (
//   <div
//     key={idx}
//     className="calender_div"
//     onClick={() => dateClickHandler(date)}
//   >
//     <div
//       className={`calender_day ${
//         todayDate === idx ? "today" : "date"
//       }`}
//     >
//       {date}
//     </div>
//     {/* {date.todos.length !== 0 && <div></div>} */}
//   </div>
// ))}
// </div>