import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { modalActions } from "../store/data-slice";
import { listActions } from "../store/list-slice";
import MakeIdx from "../library/MakeIdx";
import classes from "./Calender.module.css";

const MakeCaledner = ({
  year,
  month,
  firstDay,
  lastDate,
  identify,
  listRef,
  allListRef,
  viewRef,
  clickedElement,
}) => {
  // console.log("makecalender");
  const dispatch = useDispatch();
  const week = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 몇 주인지?

  // {email: '', name: '', schedule: []}
  const modalState = useSelector((state) => state.modal);
  const listState = useSelector((state) => state.list);

  const [listBoxHeightCount, setHeight] = useState("");

  // {idx: '', todo: [ ... {}...]}
  const schedule = modalState.userSchedule;
  const modalVisible = modalState.isVisible;

  useEffect(() => {
    // 컴포넌트의 return 실행 후, state에 값을 저장후 랜더링
    // console.log("useEffect setHeight");
    setHeight(
      Math.floor(
        (viewRef.current.clientHeight - 64 - 45 - 24 * week) / (24 * week)
      )
    );
  }, [viewRef, week]);

  const getListBoxSize = useCallback(() => {
    setHeight(
      Math.floor(
        (viewRef.current.clientHeight - 64 - 45 - 24 * week) / (24 * week)
      )
    );
  }, [viewRef, week]);

  useEffect(() => {
    // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.

    window.addEventListener("resize", getListBoxSize);
  });

  const addClickHandler = (idx, day, week) => {
    const type = "add";
    if (!modalVisible) {
      dispatch(
        modalActions.clickedDate({ type, idx, day, week, dateArray: [idx] })
      );
    }
  };

  const listClickHandler = (event, object, week, day, index) => {
    clickedElement.current = event.target;
    dispatch(
      listActions.clickedList({
        object,
        week,
        day,
        index,
      })
    );
  };

  const allListClickHandler = (event, date, day, week) => {
    clickedElement.current = event.target;
    if (listState.isVisible) {
      dispatch(listActions.offModal());
    }
    dispatch(allListActions.clickedListBox({ date, day, week }));
  };

  const calculateWidth = (date, day, endDate) => {
    // [년, 월, 일]
    if (date === endDate) return;

    let item = date.split("-");
    item[2] = String(+item[2] + 7 - day).padStart(2, "0");

    let lastDateOfWeek = item[0] + "-" + item[1] + "-" + item[2];

    if (lastDateOfWeek < endDate) return 7 - day + 1;
    else return new Date(endDate).getDay() + 1 - day + 1;
  };

  const scheduleHandler = (date, day, week, array) => {
    if (!schedule[date]) return;

    const dateInfo = date.split("-");
    let year = dateInfo[0];
    let month = dateInfo[1];
    let index = 0;
    // array 배열 만들기
    for (const key in schedule[date]) {
      const object = schedule[date][key];

      if (object.startDate < date && day !== 1) continue;
     
      const isLong = object.startDate < object.endDate ? true : false;
      let arrayCount = 0;
      let barWidth = calculateWidth(date, day, object.endDate);
      let thisDate = +dateInfo[2];

      for (let item of array[day]) {
        if (arrayCount >= listBoxHeightCount) break;

        if (item) {
          arrayCount += 1;
          continue;
        }

        let isMore = arrayCount < listBoxHeightCount - 1 ? false : true;

        for (let i = day; i <= 7; i++) {
          if (i === 8) break;

          let date =
            year + "-" + month + "-" + thisDate.toString().padStart(2, 0);

          if (date > object.endDate) break;

          array[i][arrayCount] = (
            <div
              key={arrayCount}
              className={`${
                !isMore
                  ? object.endDate > object.startDate
                    ? classes["list-boundary-long"]
                    : classes["list-boundary-short"]
                  : classes["list-more"]
              }`}
              style={{
                width: isLong && !isMore ? `${barWidth}00%` : "100%",
                top: `${24 * arrayCount}px`,
                display: i === day || isMore ? "flex" : "none",
              }}

              onClick={(event) => {
                event.stopPropagation();
                !isMore
                  ? listClickHandler(event, object, week, day, index)
                  : allListClickHandler(event, date, day, week);
              }}
              ref={(el) => {
                listRef.current[`${date}${object.key}`] = el;
              }}
            >
              {!isLong && arrayCount < listBoxHeightCount - 1 && (
                <div
                  className={`${object.color} ${classes["color-bar"]}`}
                ></div>
              )}
              <div
                key={object.key}
                className={`${classes.list} ${
                  isLong && !isMore && `${classes.long} ${object.color}`
                }`}
                style={{
                  backgroundColor:
                    listState.isVisible &&
                    object.key === listState.key &&
                    "rgba(182, 182, 182, 0.6)",
                }}
                dayindex={day}
              >
                <div
                  className={`${classes["type-one"]}  ${
                    object.isDone && classes.done
                  }`}
                >
                  {isMore
                    ? `${
                        Object.keys(schedule[date]).length -
                        listBoxHeightCount +
                        1
                      }개 더보기`
                    : (object.startTime + " " + object.title)}
                </div>
                <div
                  className={`${classes["type-two"]} ${
                    object.isDone && classes.done
                  }`}
                >
                  {isMore
                    ? `+${
                        Object.keys(schedule[date]).length -
                        listBoxHeightCount +
                        1
                      }`
                    : " " + object.title}
                </div>
              </div>
            </div>
          );
          thisDate += 1;
        }
        break;
      }
      index += 1;
    }
    return array[day];
  };

  const monthArray = [];

  ////////////////////////////////////////////////
  /* 날짜 생성하기 */
  const makeDay = (week, array) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          //ex) 첫 주에 28, 29, 30, 31, 1, 2, 3 표현하기 위함
          const date = prevMonthLastDate - firstDay + i;
          const idx = MakeIdx("prev", year, month, date);
          const day = i; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                addClickHandler(idx, day, week);
              }}
              className={classes.date_box}
              day-index={day}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && day === 1
                      ? classes.sunday
                      : day === 7 && classes.saturday
                  }`}
                >
                  {date}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, day, week, array)}
                </div>
              </div>
            </td>
          );
        } else {
          const date = i - firstDay;
          const idx = MakeIdx("", year, month, date);
          const day = i;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, day, week);
                }
              }}
              className={classes.date_box}
              day-index={day}
            >
              <div className={classes.date}>
                <h2
                  style={{ width: date === 1 && "54px" }}
                  className={`
                  ${identify === idx && classes.Today}
                  ${
                    identify !== idx && day === 1
                      ? classes.sunday
                      : day === 7 && classes.saturday
                  }`}
                >
                  {date === 1 ? `${month}월 1일` : date}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, day, week, array)}
                </div>
              </div>
            </td>
          );
        }
      }
    }

    if (week !== 1) {
      const startDate = (week - 1) * 7;

      for (let i = startDate; i <= week * 7 - 1; i++) {
        if (i - firstDay < lastDate) {
          const nowDate = i - firstDay + 1;
          const idx = MakeIdx("", year, month, nowDate);
          const day = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, day, week);
                }
              }}
              className={classes.date_box}
              day-index={day}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && day === 1
                      ? classes.sunday
                      : day === 7 && classes.saturday
                  }`}
                >
                  {nowDate}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, day, week, array)}
                </div>
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeIdx("next", year, month, nowDate);
          const day = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, day, week);
                }
              }}
              className={classes.date_box}
              day-index={day}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && day === 1
                      ? classes.sunday
                      : day === 7 && classes.saturday
                  }`}
                  style={{ width: nowDate === 1 && "54px" }}
                >
                  {nowDate === 1
                    ? month === 12
                      ? "1월 1일"
                      : `${month + 1}월 1일`
                    : nowDate}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, day, week, array)}
                </div>
              </div>
            </td>
          );
        }
      }
    }
    return thisMonthArray;
  };

  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  for (let i = 1; i <= week; i++) {
    const array = [
      "",
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
    ];

    monthArray.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i, array)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;
