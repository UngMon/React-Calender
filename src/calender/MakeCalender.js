import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/listmodal-slice";
import { modalActions } from "../store/modal-slice";
import classes from "./Calender.module.css";

const MakeCaledner = ({ year, month, firstDay, lastDate }) => {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.schedule);
  console.log(schedule);
  console.log("make렌더링");

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

  const listClickHandler = (
    date,
    week,
    dayIdx,
    item,
    listIndex,
    scheduleIndex
  ) => {
    dispatch(
      listActions.clickedList({
        date,
        week,
        dayIdx,
        item,
        listIndex,
        scheduleIndex,
      })
    );
  };

  const allListClickHandler = (date, day, week, scheduleIndex) => {
    dispatch(allListActions.toggle());
    dispatch(allListActions.clickedListBox({date, day, week, scheduleIndex}));
  };

  const scheduleHandler = (nowDate, dayIdx, week) => {
    const toDoList = schedule.find((item) => item.idx === nowDate);

    if (toDoList) {
      const scheduleIndex = schedule.indexOf(toDoList);
      const todolength = toDoList.todo.length;

      return toDoList.todo.map((item, listIndex) =>
        listIndex <= 2 ? (
          <div
            key={listIndex}
            className={classes.list}
            onClick={(event) => {
              event.stopPropagation();
              listClickHandler(
                nowDate,
                week,
                dayIdx,
                item,
                listIndex,
                scheduleIndex
              );
            }}
            dayindex={dayIdx}
          >
            {item}
          </div>
        ) : (
          listIndex === 3 && (
            <div
              key={listIndex}
              className={classes.list}
              onClick={(event) => {
                event.stopPropagation();
                allListClickHandler(nowDate, dayIdx, week, scheduleIndex);
              }}
            >{` ${todolength - 3}개 더보기`}</div>
          )
        )
      );
    }
    return;
  };

  const addClickHandler = (idx, dayIndex, week) => {
    dispatch(modalActions.clickedData({ idx, dayIndex, week }));
    dispatch(modalActions.toggle());
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
          const dayIdx = `day-${i}`; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, i, week)}
              </div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = makeKey("", year, month, nowDate);
          const dayIdx = `day-${i}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, i, week)}
              </div>
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
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, (i % 7) + 1, week)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, (i % 7) + 1, week)}
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = makeKey("next", year, month, nowDate);
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, (i % 7) + 1, week)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>{nowDate}</div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, (i % 7) + 1, week)}
              </div>
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
