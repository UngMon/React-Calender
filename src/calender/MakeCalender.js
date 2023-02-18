import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { modalActions } from "../store/modal-slice";
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
  console.log("makecalender");
  const dispatch = useDispatch();
  const week = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 몇 주인지?
  // {email: '', name: '', schedule: []}
  const modalState = useSelector((state) => state.modal);
  const listState = useSelector((state) => state.list);

  const [listBoxHeightCount, setHeight] = useState("");

  // {idx: '', todo: [ ... {}...]}
  const schedule = modalState.userSchedule.schedule;
  const modalVisible = modalState.isVisible;

  // console.log(schedule);
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
    // console.log("window addEveentListener");
    window.addEventListener("resize", getListBoxSize);
  });

  const addClickHandler = (idx, day, week) => {
    const type = "add";
    if (!modalVisible) {
      dispatch(modalActions.clickedDate({ type, idx, day, week }));
    }
  };

  const listClickHandler = (
    event,
    style,
    color,
    startDate,
    endDate,
    startTime,
    endTime,
    week,
    day,
    title,
    key,
    arr
  ) => {
    clickedElement.current = event.target;
    dispatch(
      listActions.clickedList({
        style,
        color,
        startDate,
        endDate,
        startTime,
        endTime,
        week,
        day,
        title,
        key,
        arr,
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

  const scheduleHandler = (date, day, week, array) => {

    const dateInfo = date.split("-");
    const year = dateInfo[0];
    const month = dateInfo[1];

    if (!schedule[year]) return;

    if (!schedule[year][month]) return;

    if (!schedule[year][month][date]) return;

    const objLength = Object.keys(schedule[year][month][date]).length;

    // array 배열 만들기
    for (const item in schedule[year][month][date]) {
      const object = schedule[year][month][date][item];
      // console.log(object.title);
      if (object.isMiddle || (object.isEnd && object.count !== 1)) {
        continue;
      }

      let arrayCount = 0;

      for (const arrayItem of array[day]) {
        if (arrayItem !== 0) {
          arrayCount += 1;
          continue;
        }

        array[day][arrayCount] = object;

        for (let i = day + 1; i < day + object.length; i++) {
          if (i === 8) break;

          array[i][arrayCount] = 1;
        }
        // array[day].sort((a, b) => a.key < b.key ? -1 : 1);
        break;
      }
    }

    let result = [];
    let visualCount = 0;
    let moreListBool = false;
    let index = 0;

    for (const item of array[day]) {
      if (item === 0) {
        index += 1;
        continue;
      }

      if (typeof item === "object") {
        if (index < listBoxHeightCount - 1) {
          visualCount += 1;
          result.push(
            <div
              key={index}
              className={`${
                item.isLong
                  ? classes["list-boundary-long"]
                  : classes["list-boundary-short"]
              }`}
              style={{
                width: item.isLong && `${item.length}00%`,
                top: `${24 * index}px`,
              }}
              onClick={(event) => {
                event.stopPropagation();
                listClickHandler(
                  event,
                  item.style,
                  item.color,
                  item.startDate,
                  item.endDate,
                  item.startTime,
                  item.endTime,
                  week,
                  day,
                  item.title,
                  item.key,
                  item.arr
                );
              }}
              ref={(el) => {
                listRef.current[`${date}${item.key}`] = el;
              }}
            >
              {!item.isLong && (
                <div className={`${item.color} ${classes["color-bar"]}`}></div>
              )}
              <div
                key={index}
                className={`${classes.list} ${
                  item.isLong && `${classes.long} ${item.color}`
                }`}
                style={{
                  backgroundColor:
                    listState.isVisible &&
                    item.key === listState.key &&
                    "rgba(182, 182, 182, 0.6)",
                }}
                dayindex={day}
              >
                <div
                  className={`${classes["type-one"]}  ${
                    item.style && classes.done
                  }`}
                >
                  {item.startTime + " " + item.title}
                </div>
                <div
                  className={`${classes["type-two"]} ${
                    item.style && classes.done
                  }`}
                >
                  {" " + item.title}
                </div>
              </div>
            </div>
          );
        }

        if (index === listBoxHeightCount - 1) {
          result.push(
            <div
              key={index}
              className={`${classes["list-more"]}`}
              style={{ top: `${24 * index}px` }}
              onClick={(event) => {
                event.stopPropagation();
                allListClickHandler(event, date, day, week);
              }}
              ref={(el) => (allListRef.current[`${date}`] = el)}
            >{`${objLength - (listBoxHeightCount - 1)}개 더보기`}</div>
          );
          moreListBool = true;
          break;
        }
      }

      if (item === 1) {
        if (index < listBoxHeightCount - 1) {
          visualCount += 1;
        }

        if (index > listBoxHeightCount - 2 && !moreListBool) {
          result.push(
            <div
              key={index}
              className={`${classes["list-more"]}`}
              style={{ marginTop: `${24 * (listBoxHeightCount - 1)}px` }}
              onClick={(event) => {
                event.stopPropagation();
                allListClickHandler(event, date, day, week);
              }}
              ref={(el) => (allListRef.current[`${date}`] = el)}
            >
              {`${objLength - visualCount}개 더보기`}
            </div>
          );
          moreListBool = true;
          break;
        }
      }
      index += 1;
      if (day === 7) {
        array = [];
      }
    }
    return result;
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
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeIdx("prev", year, month, nowDate);
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
          const nowDate = i - firstDay;
          const idx = MakeIdx("", year, month, nowDate);
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
                  style={{ width: nowDate === 1 && "54px" }}
                  className={`
                  ${identify === idx && classes.Today}
                  ${
                    identify !== idx && day === 1
                      ? classes.sunday
                      : day === 7 && classes.saturday
                  }`}
                >
                  {nowDate === 1 ? `${month}월 1일` : nowDate}
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
