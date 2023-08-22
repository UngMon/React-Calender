import React, { useCallback, useEffect, useState } from "react";
import { ModalType } from "../type/ReduxType";
import MakeIdx from "../utils/MakeIdx";
import classes from "./MakeCalender.module.css";

interface T {
  year: string;
  month: string;
  modal: ModalType;
  firstDay: number;
  lastDate: number;
  lastWeek: number;
  setIsDragging: (value: boolean) => void;
}

const CloneList = ({
  year,
  month,
  modal,
  firstDay,
  lastDate,
  lastWeek,
  setIsDragging,
}: T) => {
  const [고정좌표] = useState<[number, number]>([+modal.day, +modal.week]);
  const [실시간좌표, 실시간좌표설정] = useState<[number, number]>([
    +modal.day,
    +modal.week,
  ]);
  const [이전좌표, 이전좌표설정] = useState<[number, number]>([0, 0]);

  const [newStart, setStartDate] = useState<string>(modal.startDate);
  const [newEnd, setEndDate] = useState<string>(modal.endDate);

  const moveDate = useCallback((date: string, move: number) => {
    const currentDate = new Date(date);

    // 1일을 밀리초 단위로 나타내는 상수
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000 * move;

    // 현재 날짜에서 하루 전 날짜를 계산
    const previousDate = new Date(currentDate.getTime() + oneDayInMilliseconds);

    // 이전 날짜를 문자열로 변환. (예: "2023-08-11")
    const previousDateFormatted = previousDate.toISOString().split("T")[0];
    return previousDateFormatted;
  }, []);

  useEffect(() => {
    if (!modal.startDate || !modal.endDate) return;
    if (실시간좌표[0] === 이전좌표[0] && 실시간좌표[1] === 이전좌표[1]) return;
    const move: number =
      (실시간좌표[1] - 고정좌표[1]) * 7 + (실시간좌표[0] - 고정좌표[0]);

    let startDate: string;
    let endDate: string;

    if (modal.mouseType === "MakeList") {
      // console.log(`MakeList ${move}`);
      startDate = move >= 0 ? modal.startDate : moveDate(modal.startDate, move);
      endDate = move >= 0 ? moveDate(modal.endDate, move) : modal.endDate;
    } else {
      startDate = moveDate(modal.startDate, move);
      endDate = moveDate(modal.endDate, move);
    }
    setStartDate(startDate);
    setEndDate(endDate);
    이전좌표설정(실시간좌표);
  }, [moveDate, modal, 고정좌표, 실시간좌표, 이전좌표]);

  const mouseEnter = (day: number, week: number) => {
    // console.log(`day, week ${day} ${week}`);
    실시간좌표설정([day, week]);
  };

  const mouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "auto";
  };

  const calculateWidth = useCallback(
    (date: string, day: number, endDate: string): number => {
      const time = new Date(date).getTime() + 24 * 60 * 60 * 1000 * (7 - day);

      let lastDateOfWeek = new Date(time).toISOString().split("T")[0];

      if (lastDateOfWeek < endDate) return 7 - day + 1;
      else return new Date(endDate).getDay() + 1 - day + 1;
    },
    []
  );

  const scheduleHandler = (date: string, day: number, week: number) => {
    if (!newStart || !newEnd) return;
    if (date < newStart! || newEnd! < date) return;
    if (day !== 1 && date !== newStart) return;

    //긴 일정인지 아닌지
    const isLong: boolean = newStart! < newEnd! ? true : false;
    // 긴 일정의 경우 화면에 보일 너비(기간)
    let barWidth: number = isLong ? calculateWidth(date, day, newEnd!) : 1;

    return (
      <div
        className={`${
          isLong
            ? classes["list-boundary-long"]
            : classes["list-boundary-short"]
        }`}
        style={{
          width: `${barWidth}00%`,
          top: `10px`,
          opacity: "0.7",
        }}
      >
        {!isLong && (
          <div className={`${modal.color} ${classes["color-bar"]}`}></div>
        )}
        <div
          className={`${classes.list}
   ${isLong && classes.long} ${modal.color || '라벤더'}`}
        >
          <div
            className={`${classes["type-two"]} ${modal.isDone && classes.done}`}
          >
            {modal.startTime + " " + modal.title}
          </div>
        </div>
      </div>
    );
  };

  const dateArray: React.ReactNode[] = [];
  // const array: ReactNode[] = [];
  let sunday: number = 0;
  // /* 날짜 생성하기 */
  const makeDay = (주: number) => {
    const thisMonthArray = [];

    let thisDate: number = 0;
    let isNext = false;

    for (let i = 1; i <= 7; i++) {
      let idx: string;

      if (주 === 1) {
        if (i <= firstDay) {
          const prevMonthLastDate = new Date(+year, +month - 1, 0).getDate();
          thisDate = prevMonthLastDate - firstDay + i;
          idx = MakeIdx("prev", year, month, thisDate);
        } else {
          thisDate = i - firstDay;
          idx = MakeIdx("", year, month, thisDate);
        }
      } else {
        if (sunday + i > lastDate) {
          thisDate = sunday + i - lastDate;
          isNext = true;
          idx = MakeIdx("next", year, month, thisDate);
        } else {
          thisDate = !isNext ? sunday + i : thisDate + 1;
          idx = MakeIdx("", year, month, thisDate);
        }
      }

      if (i === 7 && sunday < lastDate) sunday = thisDate;
      // console.log(`handler ${idx} ${i} ${주}`)
      thisMonthArray.push(
        <td
          key={idx}
          className={classes.date_box}
          onMouseEnter={() => mouseEnter(i, 주)}
          onMouseUp={mouseUp}
        >
          <div className={classes.date}>
            <div className={classes["date-h"]} />
          </div>
          <div className={classes["list-box"]}>
            <div className={classes["list-area"]}>
              {scheduleHandler(idx, i, 주)}
            </div>
          </div>
        </td>
      );
    }
    return thisMonthArray;
  };

  for (let i = 1; i <= lastWeek; i++) {
    dateArray.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i)}
      </tr>
    );
  }
  // console.log(dateArray);

  return (
    <div
      className={classes.calender}
      style={{ position: "absolute", bottom: 0, zIndex: "20" }}
    >
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
        <tbody className={classes.presentation}>{dateArray}</tbody>
      </table>
    </div>
  );
};

export default CloneList;

// let newStartDate = +startDate + move;
// let newStartMonth: number = +startMonth;
// let newStartYear: number = +startYear;

// if (newStartDate < 0) {
//   newStartDate =
//     new Date(+startYear, +startMonth - 1, 0).getDate() - newStartDate;
//   // 그래도 0 보다 작다는 의미는 일정이 저저번달로 넘어간 상황.
//   if (newStartDate < 0) {
//     if (+startMonth - 2 < 1) {
//       newStartMonth = 12;
//       newStartYear -= 1;
//     } else {
//       newStartMonth = +startMonth - 2;
//     }
//     newStartDate =
//       new Date(newStartYear, newStartMonth - 1, +startDate).getDate() -
//       newStartDate;
//   }
// }

// let newEndDate = +endDate + move;
// let newEndMonth: number = +startMonth;
// let newEndYear: number = +startYear;

// if (newEndDate < 0) {
//   newEndDate =
//     new Date(+endYear, +endMonth - 1, 0).getDate() - newEndDate;
//   if (newEndDate < 0) {
//     if (+endMonth - 2 < 1) {
//       newEndMonth = 12;
//       newEndYear -= 1;
//     } else {
//       newEndMonth = +endMonth - 2;
//     }
//     newEndDate =
//       new Date(newEndYear, newEndMonth - 1, newEndDate).getDate() -
//       newEndDate;
//   }
// }

// setStartDate(
//   newStartYear +
//     "-" +
//     String(newStartMonth).padStart(2, "0") +
//     "-" +
//     String(newStartDate).padStart(2, "0")
// );
// setEndDate(
//   newEndYear +
//     "-" +
//     String(newEndMonth).padStart(2, "0") +
//     "-" +
//     String(newEndDate).padStart(2, "0")
// );
// const findFinalWeek = (): number => {
//   switch (true) {
//     case startYear === year && startMonth === month:
//       return endYear === year && endMonth === month
//         ? Math.ceil(
//             new Date(endYear + endMonth + endDate).getDay() + +endDate / 7
//           )
//         : lastWeek;
//     case endYear === year && endMonth === month:
//       return Math.ceil(
//         new Date(endYear + endMonth + endDate).getDay() + +endDate / 7
//       );
//     default:
//       return lastWeek;
//   }
// };
// 현재 달이 선택한 리스트와 같은 년, 달 인지 아닌지에 따라 week 가 다름.
// const sw = year === startYear && month === startMonth ? +modal.week : 1;

// const finalWeek: number = findFinalWeek(); // const [startYear, startMonth, startDate] = modal.startDate.split("-");
// const [endYear, endMonth, endDate] = modal.endDate.split("-");
// console.log(startDate);
// const moveDay = useCallback(
//   (x: number) => {
//     switch (true) {
//       case 0 < x && x <= viewRef.current!.clientWidth / 7:
//         return 1;
//       case viewRef.current!.clientWidth / 7 < x &&
//         x <= (viewRef.current!.clientWidth * 2) / 7:
//         return 2;
//       case (viewRef.current!.clientWidth * 2) / 7 < x &&
//         x <= (viewRef.current!.clientWidth * 3) / 7:
//         return 3;
//       case (viewRef.current!.clientWidth * 3) / 7 < x &&
//         x <= (viewRef.current!.clientWidth * 4) / 7:
//         return 4;
//       case (viewRef.current!.clientWidth * 4) / 7 < x &&
//         x <= (viewRef.current!.clientWidth * 5) / 7:
//         return 5;
//       case (viewRef.current!.clientWidth * 5) / 7 < x &&
//         x <= (viewRef.current!.clientWidth * 6) / 7:
//         return 6;
//       case (viewRef.current!.clientWidth * 6) / 7 < x &&
//         x <= viewRef.current!.clientWidth:
//         return 7;
//     }
//   },
//   [viewRef]
// );

// const moveWeek = useCallback(
//   (y: number) => {
//     switch (true) {
//       case 0 < y && y <= viewRef.current!.clientHeight / lastWeek + 25:
//         return 1;
//       case viewRef.current!.clientHeight / lastWeek + 25 < y &&
//         y <= (viewRef.current!.clientHeight * 2) / lastWeek + 25:
//         return 2;
//       case (viewRef.current!.clientHeight * 2) / lastWeek + 25 < y &&
//         y <= (viewRef.current!.clientHeight * 3) / lastWeek + 25:
//         return 3;
//       case (viewRef.current!.clientHeight * 3) / lastWeek + 25 < y &&
//         y <= (viewRef.current!.clientHeight * 4) / lastWeek + 25:
//         return 4;
//       case (viewRef.current!.clientHeight * 4) / lastWeek + 25 < y &&
//         y <= viewRef.current!.clientHeight:
//         return 5;
//     }
//   },
//   [viewRef, lastWeek]
// );

// for (let item of array[+day]) {
// // 리스트 개수가 화면에 보이는 날짜 칸을 넘어가면 break;

//   for (let i = +day; i <= 7; i++) {
//     if (i === 8) break;

//     let date =
//       year + "-" + month + "-" + thisDate.toString().padStart(2, "0");

//     if (date > end) break;

//     array[i] = (
//       <div
//         key={arrayCount}
//         className={`${
//           end > start
//             ? classes["list-boundary-long"]
//             : classes["list-boundary-short"]
//         }`}
//         style={{
//           width: isLong ? `${barWidth}00%` : "100%",
//           top: `24.5px`,
//         }}
//       >
//         {/* {!isLong && (
//           <div className={`${object.color} ${classes["color-bar"]}`}></div>
//         )} */}
//         <div
//           className={`${classes.list}
//              ${isLong && classes.long} ${modal.color}`}
//           style={{
//             opacity: "0.7",
//           }}
//         >
//           <div
//             className={`${classes["type-two"]} ${
//               modal.isDone && classes.done
//             }`}
//           >
//             {" " + modal.title}
//           </div>
//         </div>
//       </div>
//     );
//     thisDate += 1;
//   // }
//   break;
// }

// return array[+day];
