import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { modalActions } from "../store/modal-slice";
import { listActions } from "../store/list-slice";
import MakeKey from "../library/MakeKey";
import classes from "./Calender.module.css";

const MakeCaledner = ({ year, month, firstDay, lastDate, identify }) => {
  console.log("makecalender");
  const dispatch = useDispatch();

  // {email: '', name: '', schedule: []}
  const modalState = useSelector((state) => state.modal);
  const listState = useSelector((state) => state.list);
  const [height, setHeight] = useState(null);

  // {idx: '', todo: [ ... {}...]}
  const schedule = modalState.userSchedule.schedule;
  const modalVisible = modalState.isVisible;

  const trRef = useRef([]);

  const listBoxHeightCount = height !== 0 ? Math.floor(height / 24) : null;
  console.log(listBoxHeightCount);
  const getListBoxSize = useCallback(() => {
    setHeight(trRef.current[0].clientHeight - 28);
  }, []);

  useEffect(() => {
    // 첫 마운트시 height state에 값을 부여
    setHeight(trRef.current[0].clientHeight - 28);
  }, []);

  useEffect(() => {
    // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.
    window.addEventListener("resize", getListBoxSize);
  });

  const listClickHandler = (
    startDate,
    week,
    dayIndex,
    listName,
    listIndex,
    scheduleIndex,
    key
  ) => {
    dispatch(
      listActions.clickedList({
        startDate,
        week,
        dayIndex,
        listName,
        listIndex,
        scheduleIndex,
        key,
      })
    );
  };

  const allListClickHandler = (date, day, week, scheduleIndex) => {
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
    console.log(date);
    console.log(`시작 ${dayIdx}`);
    console.log(todoInfo);
    let positionIndex; // 화면에 보일 일정들의 위치를 저장하는 변수.
    let todoCount = 0;

    for (const item of todoInfo) {
      if (item.isMiddle) {
        continue;
      }

      let arrayCount = 0;
      
      for (const arrayItem of array[dayIdx]) {
        if (arrayItem !== 0) {
          arrayCount += 1;
          continue;
        }

        for (let i = dayIdx; i < dayIdx + item.length; i++) {
          if (i === 8) break;
          array[i][arrayCount] = {
            week: week,
            dayIndex: dayIdx,
            title: item.title,
            listIndex: todoCount,
            index: todoIndex,
            key: item.index,
            isLong: item.isLong ? true : false,
            isStart: item.isStart ? true : false,
            isEnd: item.isEnd ? true : false,
          };

          if (!item.isLong) break;
        }
        positionIndex = arrayCount;
        arrayCount += 1;
        break;
      }
      todoCount += 1;
      console.log(array);
    }
  };

  const addClickHandler = (idx, dayIndex, week) => {
    if (!modalVisible) {
      dispatch(modalActions.clickedStartDate({ idx, dayIndex, week }));
    }
    dispatch(modalActions.onModal());
  };

  const monthArray = [];

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
              onClick={() => addClickHandler(idx, dayIdx, week)}
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
              onClick={() => addClickHandler(idx, dayIdx, week)}
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
              onClick={() => addClickHandler(idx, dayIdx, week)}
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
              onClick={() => addClickHandler(idx, dayIdx, week)}
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
        }
      }
    }
    return thisMonthArray;
  };
  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  const week = Math.ceil((firstDay + lastDate) / 7);

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
      <tr
        key={i}
        className={`week ${i}`}
        ref={(el) => (i === 1 ? (trRef.current[i - 1] = el) : null)}
      >
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

// for (const item of todoInfo) {
//   if (todoCount === listBoxHeightCount || !item.isMiddle) {
//     continue;
//   }
//   console.log(item)
//   let arrayCount = 0;

//   array[dayIdx].some((arrayItem, arrayIdx) =>  {
//     if (arrayItem !== 0) return false; // continue;

//     for (let i = dayIdx; i < dayIdx + item.length; i++) {
//       if (i === 8) break;

//       array[i][arrayIdx] = {
//         week: week,
//         dayIndex: dayIdx,
//         title: item.title,
//         listIndex: todoCount,
//         index: todoIndex,
//         key: item.index,
//         isLong: item.isLong ? true : false,
//         isStart: item.isStart ? true : false,
//         isEnd: item.isEnd ? true : false,
//       };
//       console.log(array[dayIdx][arrayCount])
//       if (!item.isLong) break;
//     }
//     positionIndex = arrayIdx;
//     arrayCount += 1;
//     return true;
//   });
//   todoCount += 1;
//   console.log(item)
//   console.log(array);
// }



    // todoInfo.some((item, tdIdx) => {
    //   // todo 안의 요소가 dummy일정이 아닌 하루 일정과 긴 일정들 일 때,
    //   if (tdIdx < listBoxHeightCount && !item.isMiddle) {
    //     // [0, 0, 0, 0, ..., 0]
    //     array[dayIdx].some((arrItem, arrIdx) => {
    //       //   // 다른 일정이 채워져 있지 않은 상태에서만..
    //       if (arrItem !== 0) return false; //continue

    //       // isLong이 true일 때, array의 요일칸에 index값을 부여해줌.
    //       for (let i = dayIdx; i < dayIdx + item.length; i++) {
    //         if (i === 8) break;
    //         array[i][arrIdx] = {
    //           week: week,
    //           dayIndex: dayIdx,
    //           title: item.title,
    //           listIndex: tdIdx,
    //           index: todoIndex,
    //           key: item.index,
    //           isLong: item.isLong ? true : false,
    //           isStart: item.isStart ? true : false,
    //           isEnd: item.isEnd ? true : false,
    //         };
    //         if (!item.isLong) {
    //           break;
    //         }
    //       }
    //       positionIndex = arrIdx;
    //       return true;
    //     });
    //   }
    // });
    // console.log(array)