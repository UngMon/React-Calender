import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import { modalActions } from "../store/modal-slice";
import { listActions } from "../store/list-slice";
import MakeKey from "../library/MakeKey";
import classes from "./Calender.module.css";

const MakeCaledner = ({ year, month, firstDay, lastDate, identify }) => {
  const dispatch = useDispatch();

  // {email: '', name: '', schedule: []}
  const modalState = useSelector((state) => state.modal);

  // {idx: '', todo: [ ... {}...]}
  const schedule = modalState.userSchedule.schedule;
  const modalVisible = modalState.isVisible;

  const listClickHandler = (
    startDate,
    week,
    dayIndex,
    listName,
    listIndex,
    scheduleIndex
  ) => {
    dispatch(
      listActions.clickedList({
        startDate,
        week,
        dayIndex,
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

  const scheduleHandler = (date, dayIdx, week, array) => {
    // {idx: 'date..', todo: [~~]}의 인덱스
    const todoIndex = schedule.findIndex((item) => item.idx === date);
    if (todoIndex === -1) {
      // console.log(`스케쥴 작동 ${date}`);
      return;
    }

    // [... , { arr: [~~], startDate: '', isLong: 'true', ...}] or undefined
    const todoInfo = schedule[todoIndex].todo;

    let positionIndex; // 화면에 보일 일정들의 위치를 저장하는 변수.

    return todoInfo.map((item, tdIdx) => {
      // 화면에 보일 일정들이 최대 4개 이므로..
      // if (tdIdx > 3) {
      //   return;
      // }

      // todo 안의 요소가 dummy일정이 아닌 하루 일정과 긴 일정들 일 때,
      if (!item.isFake) {
        // [0, 0, 0, 0]
      
        array[dayIdx].some((arrItem, arrIdx) => {
          // 다른 일정이 채워져 있지 않은 상태에서만..
          if (arrItem !== 0) return false; //continue

          array[dayIdx][arrIdx] = item.index;

          // isLong이 true일 때, array의 요일칸에 index값을 부여해줌.
          if (item.isLong) {
            for (let i = dayIdx + 1; i < dayIdx + item.length; i++) {
              if (i === 8) break;
              // console.log(week)
              // console.log(i)
              // console.log(item.length)
              // console.log(array)
              // console.log(item.index);
              // console.log(tdIdx);
              array[i][arrIdx] = item.index;
            }
          }

          positionIndex = arrIdx;

          return true;
        });
      }
 
      return !item.isFake && tdIdx < 4 ? (
        <div
          key={item.index + tdIdx}
          className={`${classes["list-boundary"]} ${
            classes[`listIndex-${positionIndex}`]
          }`}
          style={{ width: item.isLong && `${item.length}00%` }}
          onClick={(event) => {
            event.stopPropagation();
            listClickHandler(
              date,
              week,
              dayIdx,
              todoInfo[tdIdx].title,
              tdIdx,
              todoIndex
            );
          }}
        >
          <div
            key={todoInfo[tdIdx].index + tdIdx}
            className={`${classes.list} ${
              todoInfo[tdIdx].style && classes.done
            } ${todoInfo[tdIdx].isLong && classes.long}`}
            dayindex={dayIdx}
          >
            <span>
              {todoInfo[tdIdx].startTime + " " + todoInfo[tdIdx].title}
            </span>
          </div>
        </div>
      ) : todoInfo[tdIdx].length > 5 && (
        // todo안의 요소가 5개 이상이면 더보기란 생성.
        <div
          key={tdIdx}
          className={`classes["list-more"]  ${classes[`listIndex-3`]}`}
          onClick={(event) => {
            event.stopPropagation();
            allListClickHandler(date, dayIdx, week, todoIndex);
          }}
        >{`${todoInfo.length - 3}개 더보기`}</div>
      );
    });
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
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                } ${
                  identify !== idx && i === 1
                    ? classes.sunday
                    : i === 7 && classes.saturday
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, dayIdx, week, array, listCount)}
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
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                } ${
                  identify !== idx && dayIdx === 1
                    ? classes.sunday
                    : i === 7
                    ? classes.saturday
                    : false
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, dayIdx, week, array, listCount)}
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
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                } ${
                  identify !== idx && dayIdx === 1
                    ? classes.sunday
                    : dayIdx === 7 && classes.saturday
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, dayIdx, week, array, listCount)}
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
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                } ${
                  identify !== idx && dayIdx === 1
                    ? classes.sunday
                    : dayIdx === 7 && classes.saturday
                }`}
              >
                {nowDate}
              </div>
              <div className={classes.list_box}>
                {scheduleHandler(idx, dayIdx, week, array, listCount)}
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
      [0, 0, 0, 0], //dayIndex = 1
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    monthArray.push(
      <tr key={i} weekindex={i} className='week'>
        {makeDay(i, array)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;

// if (todoIndex !== -1) {
//   return schedule[todoIndex].todo.map((item, listIndex) =>
//     listIndex <= 3 ? (
//       item.isFake === false && array[listIndex] === 0 ? (
//         ((array[listIndex] = 1),
//         (
//           <div
//             key={item.startTime + " " + item.endTime + listIndex}
//             className={`${classes["list-boundary"]}`}
//             style={{ width: `${item.length}00%` }}
//             onClick={(event) => {
//               event.stopPropagation();
//               listClickHandler(
//                 date,
//                 week,
//                 dayIdx,
//                 item.title,
//                 listIndex,
//                 scheduleIndex
//               );
//             }}
//           >
//             <div
//               key={item.startTime + " " + item.endTime + listIndex}
//               id={item.startTime}
//               className={`${classes.list} ${item.style && classes.done} ${
//                 item.isLong && classes.long
//               }`}
//               dayindex={dayIdx}
//             >
//               <span>{item.startTime + " " + item.title}</span>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div
//           key={listIndex}
//           className={classes.nothing}
//           style={{ pointerEvents: "none" }}
//         ></div>
//       )
//     ) : (
//       listIndex === 4 && (
//         <div
//           key={listIndex}
//           className={classes["list-more"]}
//           onClick={(event) => {
//             event.stopPropagation();
//             allListClickHandler(date, dayIdx, week, scheduleIndex);
//           }}
//         >{`${toDoList.todo.length - 3}개 더보기`}</div>
//       )
//     )
//   );
// }
// return;

// array[dayIdx].map((item, idx) => {
// [0, 0, 0, 0]

// const todoInfo = schedule[todoIndex].todo[idx];

// if (todoInfo === undefined) {
//   return null;
// }

// if (todoInfo.isFake) {
//   return null;
// }

// if (item === 0) {
//   array[dayIdx][idx] = todoInfo.index;

//   if (todoInfo.isLong) {
//     for (let i = dayIdx + 1; i < todoInfo.length + dayIdx - 1; i++) {
//       array[i][idx] = todoInfo.index;
//     }
//   }

// return (
//   <div
//     key={todoInfo.index + idx}
//     className={`${classes["list-boundary"]}`}
//     style={{ width: `${todoInfo.length}00%` }}
//     onClick={(event) => {
//       event.stopPropagation();
//       listClickHandler(
//         date,
//         week,
//         dayIdx,
//         todoInfo.title,
//         idx,
//         todoIndex
//       );
//     }}
//   >
//     <div
//       key={todoInfo.index + idx}
//       className={`${classes.list} ${todoInfo.style && classes.done} ${
//         todoInfo.isLong && classes.long
//       } ${classes[`listIndex-${idx}`]}`}
//       dayindex={dayIdx}
//     >
//       <span>{todoInfo.startTime + " " + todoInfo.title}</span>
//     </div>
//   </div>
// );

// 입력된 리스트 개수가 4개 이상일 때, 더보기란 생성
//   if (idx === 3) {
//     if (schedule[todoIndex].todo.length > 4) {
//       return (
//         <div
//           key={idx}
//           className={`classes["list-more"]  ${classes[`listIndex-${idx}`]}`}
//           onClick={(event) => {
//             event.stopPropagation();
//             allListClickHandler(date, dayIdx, week, todoIndex);
//           }}
//         >{`${todoInfo.length - 3}개 더보기`}</div>
//       );
//     } else {
//       return (
//         <div
//           key={todoInfo.index + idx}
//           className={`${classes["list-boundary"]}`}
//           style={{ width: `${todoInfo.length}00%` }}
//           onClick={(event) => {
//             event.stopPropagation();
//             listClickHandler(
//               date,
//               week,
//               dayIdx,
//               todoInfo.title,
//               idx,
//               todoIndex
//             );
//           }}
//         >
//           <div
//             key={todoInfo.index + idx}
//             className={`${classes.list} ${todoInfo.style && classes.done} ${
//               todoInfo.isLong && classes.long
//             } ${classes[`listIndex-${idx}`]}`}
//             dayindex={dayIdx}
//           >
//             <span>{todoInfo.startTime + " " + todoInfo.title}</span>
//           </div>
//         </div>
//       );
//     }
//   }
//   return todoInfo;
// });
