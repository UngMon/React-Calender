import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { modalActions } from "../store/modal-slice";
import { listActions } from "../store/list-slice";
import MakeKey from "../library/MakeKey";
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
  listBoxHeightCountRef,
}) => {
  console.log("makecalender");
  const dispatch = useDispatch();
  const week = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 몇 주인지?
  // {email: '', name: '', schedule: []}
  const modalState = useSelector((state) => state.modal);
  const listState = useSelector((state) => state.list);

  const [listBoxHeightCount, setHeight] = useState("");
  listBoxHeightCountRef.current = listBoxHeightCount;

  // {idx: '', todo: [ ... {}...]}
  const schedule = modalState.userSchedule.schedule;
  const modalVisible = modalState.isVisible;

  useEffect(() => {
    // 컴포넌트의 return 실행 후, state에 값을 저장후 랜더링
    setHeight(
      Math.floor((viewRef.current.clientHeight - 26 - 24 * week) / (24 * week))
    );
  }, [viewRef, week]);

  const getListBoxSize = useCallback(() => {
    setHeight(
      Math.floor((viewRef.current.clientHeight - 26 - 24 * week) / (24 * week))
    );
  }, [week, viewRef]);

  useEffect(() => {
    // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.
    window.addEventListener("resize", getListBoxSize);
  });

  const listClickHandler = (
    event,
    week,
    dayIndex,
    listName,
    listIndex,
    scheduleIndex,
    key
  ) => {
    clickedElement.current = event.target;
    dispatch(
      listActions.clickedList({
        week,
        dayIndex,
        listName,
        listIndex,
        scheduleIndex,
        key,
      })
    );
  };

  const allListClickHandler = (event, date, day, week, scheduleIndex) => {
    clickedElement.current = event.target;
    if (listState.isVisible) {
      dispatch(listActions.offModal());
    }
    dispatch(allListActions.clickedListBox({ date, day, week, scheduleIndex }));
  };

  const scheduleHandler = (date, dayIdx, week, array) => {
    // {idx: 'date..', todo: [~~]}의 인덱스
    const todoIndex = schedule.findIndex((item) => item.idx === date);

    if (todoIndex === -1) {
      return;
    }

    // [... , { arr: [~~], startDate: '', isLong: 'true', ...}] or undefined
    const todoInfo = schedule[todoIndex].todo;

    let todoCount = 0;

    for (const item of todoInfo) {
      if (item.isMiddle) {
        todoCount += 1;
        continue;
      }

      let arrayCount = 0;

      for (const arrayItem of array[dayIdx]) {
        if (arrayItem !== 0) {
          arrayCount += 1;
          continue;
        }

        array[dayIdx][arrayCount] = {
          week: week,
          dayIndex: dayIdx,
          startTime: item.startTime,
          endTime: item.endTime,
          title: item.title,
          listIndex: todoCount,
          index: todoIndex,
          key: item.index,
          length: item.length,
          color: item.color,
          style: item.style,
          isLong: item.isLong,
          isStart: item.isStart,
          isMiddle: item.isMiddle,
          isEnd: item.isEnd,
        };

        for (let i = dayIdx + 1; i < dayIdx + item.length; i++) {
          if (i === 8) break;

          array[i][arrayCount] = 1;

          if (!item.isLong) break;
        }
        arrayCount += 1;
        break;
      }
      todoCount += 1;
    }
    ///////////////////////////////////////////////////////
    return array[dayIdx].map((item, idx) =>
      !item.isMiddle && isNaN(item) ? (
        idx < listBoxHeightCount - 1 ? (
          <div
            key={idx}
            className={`${
              item.isLong
                ? classes["list-boundary-long"]
                : classes["list-boundary-short"]
            }`}
            style={{
              width: item.isLong && `${item.length}00%`,
              top: `${24 * idx}px`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              listClickHandler(
                event,
                week,
                dayIdx,
                item.title,
                item.listIndex, // listIndex
                todoIndex, // scheduleIndex
                item.key // key
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
              key={idx}
              className={`${classes.list} ${
                item.isLong && `${classes.long} ${item.color}`
              }`}
              style={{
                backgroundColor:
                  listState.isVisible &&
                  item.key === listState.key &&
                  "rgba(182, 182, 182, 0.8)",
              }}
              dayindex={dayIdx}
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
        ) : (
          idx === listBoxHeightCount - 1 && (
            <div
              key={idx}
              className={`${classes["list-more"]}`}
              style={{ top: `${24 * idx}px` }}
              onClick={(event) => {
                event.stopPropagation();
                allListClickHandler(event, date, dayIdx, week, todoIndex);
              }}
              ref={(el) => (allListRef.current[`${date}${item.key}`] = el)}
            >{`${todoInfo.length - (listBoxHeightCount - 1)}개 더보기`}</div>
          )
        )
      ) : (
        idx === listBoxHeightCount - 1 &&
        item === 1 && (
          <div
            key={idx}
            className={`${classes["list-more"]} ${idx}`}
            style={{ marginTop: `${24 * (listBoxHeightCount - 1)}px` }}
            onClick={(event) => {
              event.stopPropagation();
              allListClickHandler(event, date, dayIdx, week, todoIndex);
            }}
            ref={(el) => (allListRef.current[`${date}${item.key}`] = el)}
          >{`${todoInfo.length - (listBoxHeightCount - 1)}개 더보기`}</div>
        )
      )
    );
  };

  const addClickHandler = (idx, dayIndex, week) => {
    const type = "add";
    if (!modalVisible) {
      dispatch(modalActions.clickedStartDate({ type, idx, dayIndex, week }));
    }
  };

  const monthArray = [];

  ////////////////////////////////////////////////
  /* 날짜 생성하기 */
  const makeDay = (week, array, listCount) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeKey("prev", year, month, nowDate);
          const dayIdx = i; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                addClickHandler(idx, dayIdx, week);
              }}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && dayIdx === 1
                      ? classes.sunday
                      : dayIdx === 7 && classes.saturday
                  }`}
                >
                  {nowDate}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, dayIdx, week, array, listCount)}
                </div>
              </div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = i;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, dayIdx, week);
                }
              }}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>
                <h2
                  style={{ width: nowDate === 1 && "54px" }}
                  className={`
                  ${identify === idx && classes.Today}
                  ${
                    identify !== idx && dayIdx === 1
                      ? classes.sunday
                      : dayIdx === 7 && classes.saturday
                  }`}
                >
                  {nowDate === 1 ? `${month}월 1일` : nowDate}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, dayIdx, week, array, listCount)}
                </div>
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
          const dayIdx = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, dayIdx, week);
                }
              }}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && dayIdx === 1
                      ? classes.sunday
                      : dayIdx === 7 && classes.saturday
                  }`}
                >
                  {nowDate}
                </h2>
              </div>
              <div className={classes["list-box"]}>
                <div className={classes["list-area"]}>
                  {scheduleHandler(idx, dayIdx, week, array, listCount)}
                </div>
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeKey("next", year, month, nowDate);
          const dayIdx = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => {
                if (!listState.isVisible) {
                  addClickHandler(idx, dayIdx, week);
                }
              }}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div className={classes.date}>
                <h2
                  className={`${identify === idx && classes.Today} ${
                    identify !== idx && dayIdx === 1
                      ? classes.sunday
                      : dayIdx === 7 && classes.saturday
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
                  {scheduleHandler(idx, dayIdx, week, array, listCount)}
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
    let array = [
      "", // 0
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
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

// //[
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
// [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0,
// ],
