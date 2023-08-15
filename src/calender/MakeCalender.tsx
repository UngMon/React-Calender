import React, { ReactNode, useEffect, useState } from "react";
import { CalenderData, DataType, ModalType } from "../type/ReduxType";
import { useAppDispatch } from "../redux/store";
import { dataActions } from "../redux/data-slice";
import { ListOrMore } from "../type/RefType";
import MakeIdx from "../utils/MakeIdx";
import classes from "./MakeCalender.module.css";
import Schedule from "./Schedule";

interface T {
  year: string;
  month: string;
  firstDay: number;
  lastDate: number;
  identify: string;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  data: DataType;
  modal: ModalType;
}

interface Parameter {
  object: CalenderData;
  date: string;
  week: string;
  day: string;
  index: number;
}

const MakeCalender = ({
  year,
  month,
  firstDay,
  lastDate,
  identify,
  viewRef,
  listRef,
  allListRef,
  clickedElement,
  data,
  modal,
}: T): React.ReactNode => {
  const dispatch = useAppDispatch();
  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?
  const [listBoxHeightCount, setHeight] = useState<number>(0);

  useEffect(() => {
    // 마운트 이후, state에 값을 저장후 랜더링
    setHeight(
      Math.floor(
        (viewRef.current!.clientHeight - 64 - 45 - 24 * week) / (24 * week)
      )
    );
  }, [viewRef, week]);

  useEffect(() => {
    const getListBoxSize = () => {
      setHeight(
        Math.floor(
          (viewRef.current!.clientHeight - 64 - 45 - 24 * week) / (24 * week)
        )
      );
    };
    // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.
    window.addEventListener("resize", getListBoxSize);
  });

  const addClickHandler = (idx: string, day: string, week: string) => {
    if (modal.listModalOpen || modal.moreModalOpen) return;
    const type = "add";

    if (!data.addModalOpen) {
      dispatch(
        dataActions.clickedDate({ type, idx, day, week, dateArray: [idx] })
      );
    }
  };

  // const dragHan = (e: React.DragEvent) => {
  //   e.movementX
  // }

  // const calculateWidth = (
  //   date: string,
  //   day: string,
  //   endDate: string
  // ): number => {
  //   let item = date.split("-"); // [년, 월, 일]
  //   item[2] = String(+item[2] + 7 - +day).padStart(2, "0");

  //   let lastDateOfWeek = item[0] + "-" + item[1] + "-" + item[2];

  //   if (lastDateOfWeek < endDate) return 7 - +day + 1;
  //   else return new Date(endDate).getDay() + 1 - +day + 1;
  // };

  // const dataClickHandler = (
  //   e: React.MouseEvent,
  //   isMore: boolean,
  //   parameter: Parameter
  // ) => {
  //   clickedElement.current = e.target as HTMLDivElement;
  //   const type: string = !isMore ? "list" : "more";
  //   const { object, date, day, week, index } = parameter;
  //   dispatch(
  //     modalActions.clickedList({ type, object, date, day, week, index })
  //   );
  // };

  // const scheduleHandler = (
  //   date: string,
  //   day: string,
  //   week: string,
  //   array: ReactNode[][]
  // ) => {
  //   if (!schedule[date]) return;

  //   const dateInfo = date.split("-");
  //   let year: string = dateInfo[0];
  //   let month: string = dateInfo[1];
  //   let index: number = 0;

  //   // array 배열 만들기
  //   for (const key in schedule[date]) {
  //     const object = schedule[date][key];

  //     if (object.startDate < date && day !== "1") continue;

  //     const isLong: boolean = object.startDate < object.endDate ? true : false;
  //     let arrayCount: number = 0;
  //     let barWidth: number =
  //       object.startDate !== object.endDate
  //         ? calculateWidth(date, day, object.endDate)
  //         : 0;
  //     let thisDate: number = +dateInfo[2];
  //     let parameter: Parameter = { object, date, week, day, index };

  //     for (let item of array[+day]) {
  //       if (arrayCount >= listBoxHeightCount) break;

  //       if (item) {
  //         arrayCount += 1;
  //         continue;
  //       }

  //       let isMore = arrayCount < listBoxHeightCount - 1 ? false : true;

  //       for (let i = +day; i <= 7; i++) {
  //         if (i === 8) break;

  //         let date =
  //           year + "-" + month + "-" + thisDate.toString().padStart(2, "0");

  //         if (date > object.endDate) break;

  //         array[i][arrayCount] = (
  //           <div
  //             key={arrayCount}
  //             className={`${
  //               !isMore
  //                 ? object.endDate > object.startDate
  //                   ? classes["list-boundary-long"]
  //                   : classes["list-boundary-short"]
  //                 : classes["list-more"]
  //             }`}
  //             style={{
  //               width: isLong && !isMore ? `${barWidth}00%` : "100%",
  //               top: `${24 * arrayCount}px`,
  //               display: i === +day || isMore ? "flex" : "none",
  //             }}
  //             onMouseUp={(event: React.MouseEvent) => {
  //               event.stopPropagation();
  //               dataClickHandler(event, isMore, parameter);
  //             }}
  //             ref={(el: HTMLDivElement) => {
  //               if (i !== +day) return;
  //               isMore
  //                 ? (allListRef.current[`${object.key}`] = el)
  //                 : (listRef.current[`${object.key}`] = el);
  //             }}
  //             onDragStart={}
  //             onDragEnter={}
  //             onDragOver={}
  //             onDragEnd={}
  //             onDragLeave={}
  //             onDrop={}
  //           >
  //             {!isLong && arrayCount < listBoxHeightCount - 1 && (
  //               <div
  //                 className={`${object.color} ${classes["color-bar"]}`}
  //               ></div>
  //             )}
  //             <div
  //               key={object.key}
  //               className={`${classes.list} ${
  //                 isLong && !isMore && `${classes.long} ${object.color}`
  //               }`}
  //               style={{
  //                 backgroundColor:
  //                   modal.listModalOpen && object.key === modal.key
  //                     ? "rgba(182, 182, 182, 0.6)"
  //                     : "",
  //               }}
  //             >
  //               <div
  //                 className={`${classes["type-one"]}  ${
  //                   object.isDone && classes.done
  //                 }`}
  //               >
  //                 {isMore
  //                   ? `${
  //                       Object.keys(schedule[date]).length -
  //                       listBoxHeightCount +
  //                       1
  //                     }개 더보기`
  //                   : object.startTime + " " + object.title}
  //               </div>
  //               <div
  //                 className={`${classes["type-two"]} ${
  //                   object.isDone && classes.done
  //                 }`}
  //               >
  //                 {isMore
  //                   ? `+${
  //                       Object.keys(schedule[date]).length -
  //                       listBoxHeightCount +
  //                       1
  //                     }`
  //                   : " " + object.title}
  //               </div>
  //             </div>
  //           </div>
  //         );
  //         thisDate += 1;
  //       }
  //       break;
  //     }
  //     index += 1;
  //   }

  //   return array[+day];
  // };

  const [dragging, setDragging] = useState<boolean>(false);

  const mouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    e.currentTarget.classList.add('dragging')
  }

  const mouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      console.log('working!')
      document.body.style.cursor = 'move'
    }
  }

  const mouseUp = (e: React.MouseEvent) => {
    setDragging(false);
    document.body.style.cursor = 'auto';
  }

  const dateArray: React.ReactNode[] = [];

  // ////////////////////////////////////////////////
  let sunday: number = 0;
  // /* 날짜 생성하기 */
  const makeDay = (주: number, array: ReactNode[][]) => {
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
          sunday = 0;
          sunday += 1;
          thisDate = sunday;
          isNext = true;
          idx = MakeIdx("next", year, month, thisDate);
        } else {
          thisDate = !isNext ? sunday + i : thisDate + 1;
          idx = MakeIdx("", year, month, thisDate);
        }
      }

      if (i === 7 && sunday <= lastDate) sunday = thisDate;
      const date = idx;
      const day = String(i);
      const week = String(주);

      thisMonthArray.push(
        <td
          key={idx}
          onMouseUp={(e: React.MouseEvent) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            addClickHandler(idx, i.toString(), 주.toString());
          }}
          className={classes.date_box}
          day-index={i}
          // draggable
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
        >
          <div className={classes.date}>
            <div className={classes["date-h"]}>
              <h2
                className={`${identify === idx && classes.Today} ${
                  identify !== idx && i === 1
                    ? classes.sunday
                    : i === 7 && classes.saturday
                }`}
              >
                {thisDate === 1
                  ? isNext
                    ? `${+month + 1}월 1일`
                    : `${+month}월 1일`
                  : thisDate}
              </h2>
            </div>
          </div>
          <div className={classes["list-box"]}>
            <div className={classes["list-area"]}>
              {Schedule({
                date,
                day,
                week,
                array,
                data,
                modal,
                listRef,
                allListRef,
                clickedElement,
                listBoxHeightCount,
              })}
            </div>
          </div>
        </td>
      );
    }
    return thisMonthArray;
  };

  for (let i = 1; i <= week; i++) {
    const array: ReactNode[][] = [
      [],
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
      new Array(25),
    ];

    dateArray.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i, array)}
      </tr>
    );
  }

  return dateArray;
};

export default MakeCalender;
/* {scheduleHandler(idx, i.toString(), week.toString(), array)} */
