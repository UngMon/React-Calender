import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import MakeKey from "../library/MakeKey";
import classes from "./Calender.module.css";

const MakeCaledner = ({ year, month, firstDay, lastDate, identify }) => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.modal.schedule);
  const modaVisible = useSelector((state) => state.modal.isVisible);
 
  console.log(`make 렌더링`);

  const listClickHandler = (
    key,
    startDate,
    week,
    month,
    date,
    dayIdx,
    listName,
    listIndex,
    scheduleIndex
  ) => {
    dispatch(
      listActions.clickedList({
        key,
        startDate,
        week,
        month,
        date,
        dayIdx,
        listName,
        listIndex,
        scheduleIndex,
      })
    );
    dispatch(listActions.onModal());
  };

  const allListClickHandler = (date, day, week, scheduleIndex) => {
    dispatch(allListActions.onModal());
    dispatch(allListActions.clickedListBox({ date, day, week, scheduleIndex }));
  };

  const scheduleHandler = (startDate, dayIdx, week, date) => {
    const toDoList = schedule.find((item) => item.idx === startDate);

    if (toDoList) {
      const scheduleIndex = schedule.indexOf(toDoList);

      return toDoList.todo.map((item, listIndex) =>
        listIndex <= 2 ? (
          <div
            key={item.firstTime + " " + item.lastTime + listIndex}
            id={item.firstTime}
            className={`${classes.list} ${item.style && classes.done}`}
            onClick={(event) => {
              event.stopPropagation();
              const key = item.firstTime + listIndex;
              listClickHandler(
                key,
                startDate,
                week,
                month,
                date,
                dayIdx,
                item.list,
                listIndex,
                scheduleIndex
              );
            }}
            dayindex={dayIdx}
          >
            {item.firstTime + " " + item.list}
          </div>
        ) : (
          listIndex === 3 && (
            <div
              key={listIndex}
              className={classes.list}
              onClick={(event) => {
                event.stopPropagation();
                allListClickHandler(startDate, dayIdx, week, scheduleIndex);
              }}
            >{` ${toDoList.todo.length - 3}개 더보기`}</div>
          )
        )
      );
    }
    return;
  };

  const addClickHandler = (idx, dayIndex, week, month, date) => {
    if (!modaVisible) {
      dispatch(modalActions.clickedData({ idx, dayIndex, week, month, date }));
    }
    dispatch(modalActions.onModal());
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeKey("prev", year, month, nowDate);
          const dayIdx = `day-${i}`; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week, month - 1, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, i, week, nowDate)}
              </div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = `day-${i}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week, month, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, i, week, nowDate)}
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
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, (i % 7) + 1, week, month, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, (i % 7) + 1, week, nowDate)}
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeKey("next", year, month, nowDate);
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, (i % 7) + 1, week, month + 1, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, (i % 7) + 1, week, nowDate)}
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
      <tr key={i}  weekindex={i}>
        {makeDay(i)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;
