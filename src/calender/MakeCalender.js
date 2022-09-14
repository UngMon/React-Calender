import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import classes from "./Calender.module.css";

const MakeCaledner = ({ year, month, firstDay, lastDate }) => {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.schedule);
  console.log(schedule);

  const makeKey = (identy, year, month, date) => {
    if (identy === "prev") {
      if (month === 0) {
        return year - 1 + "." + 11 + "." + date;
      } else {
        return year + "." + (month - 1) + "." + date;
      }
    } else if (identy === "next") {
      if (month === 11) {
        return year + 1 + "." + 0 + "." + date;
      } else {
        return year + "." + (month + 1) + "." + date;
      }
    } else {
      return year + "." + month + "." + date;
    }
  };

  const listClickHandler = (date, dayIdx, item, listIndex, scheduleIndex) => {
    dispatch(
      listActions.clickedList({ date, dayIdx, item, listIndex, scheduleIndex })
    );
  };

  const scheduleHandler = (nowDate, dayIdx) => {
    const toDoList = schedule.find((item) => item.idx === nowDate);
    if (toDoList && toDoList.todo) {
      const scheduleIndex = schedule.indexOf(toDoList);
      return toDoList.todo.map((item, listIndex) => (
        <div
          key={Math.random()}
          className={classes.list}
          onClick={(event) => {
            event.stopPropagation();
            listClickHandler(nowDate, dayIdx, item, listIndex, scheduleIndex)}
          }
          dayindex={dayIdx}
        >
          {item}
        </div>
      ));
    }
    return;
  };

  const addClickHandler = (index) => {
    dispatch(modalActions.toggle(index));
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = makeKey("prev", year, month, nowDate);
          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx)}
              className={classes.date_box}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>{scheduleHandler(idx, i)}</div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = makeKey("", year, month, nowDate);

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx)}
              className={classes.date_box}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>{scheduleHandler(idx)}</div>
            </td>
          );
        }
      }
    } else {
      const startDate = (week - 1) * 7;
      for (let i = startDate; i <= week * 7 - 1; i++) {
        if (i - firstDay < lastDate) {
          const nowDate = i - firstDay + 1;
          const idx = makeKey("", year, month, nowDate);
          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx)}
              className={classes.date_box}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>{scheduleHandler(idx)}</div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = makeKey("next", year, month, nowDate);
          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx)}
              className={classes.date_box}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>{scheduleHandler(idx)}</div>
            </td>
          );
        }
      }
    }
    return thisMonthArray;
  };
  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  const week = Math.ceil((firstDay + lastDate) / 7);
  for (let i = 1; i <= week; i++) {
    monthArray.push(
      <tr key={i} className={classes.list_box} weekindex={i}>
        {makeDay(i)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;
