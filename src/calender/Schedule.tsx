import React, { ReactNode, useState, useRef } from "react";
import { useAppDispatch } from "../redux/store";
import { CalenderData } from "../type/ReduxType";
import { modalActions } from "../redux/modal-slice";
import { ModalType, DataType } from "../type/ReduxType";
import { ListOrMore } from "../type/RefType";
import classes from "./MakeCalender.module.css";

interface T {
  date: string;
  day: string;
  week: string;
  array: ReactNode[][];
  data: DataType;
  modal: ModalType;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  listBoxHeightCount: number;
}

interface Parameter {
  object: CalenderData;
  date: string;
  week: string;
  day: string;
  index: number;
}

const Schedule = ({
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
}: T) => {
  const dispatch = useAppDispatch();
  const schedule = data.userSchedule;
  const [dragOver, setDragOver] = useState<boolean>(false)
  const [dragPos, setDragPos] = useState<[number, number]>([0, 0]);
  const dragRef = useRef<ListOrMore>({});

  if (!schedule[date]) return;

  const dragStartHandler = (e: React.DragEvent) => {
    // e.preventDefault();
    // console.log(e);
    // dragRef.current['1'] = e.currentTarget;
    setDragPos([e.clientX, e.clientY]);
    e.currentTarget.setAttribute('draggable', 'false');
    console.log("start");
  };

  const dragEndHander = (e: React.DragEvent) => {
    e.preventDefault();
    console.log(e);
    console.log("end");
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    e.preventDefault();
    console.log(e);
    console.log("leave");
  };

  const dragOverHandler = (e: React.DragEvent) => {
    
    console.log(e.movementX, e.movementY);
    console.log(e.pageX, e.pageY);
    // // console.log(e.currentTarget.classList.add(`${classes.dragover}`))
    // // e.currentTarget.classList.add(`${classes.dragover}`)
    console.log("over");
  };

  const dragHanlder = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log(e);
    console.log(e.pageX, e.pageY);
    console.log(e.view)
    //  e.currentTarget.classList.add(`${classes.dragover}`)
    console.log('drag')
  }

  const mousemove = (e: React.MouseEvent) => {
    console.log(e)
  }

  const calculateWidth = (
    date: string,
    day: string,
    endDate: string
  ): number => {
    let item = date.split("-"); // [년, 월, 일]
    item[2] = String(+item[2] + 7 - +day).padStart(2, "0");

    let lastDateOfWeek = item[0] + "-" + item[1] + "-" + item[2];

    if (lastDateOfWeek < endDate) return 7 - +day + 1;
    else return new Date(endDate).getDay() + 1 - +day + 1;
  };

  const dataClickHandler = (
    e: React.MouseEvent,
    isMore: boolean,
    parameter: Parameter
  ) => {
    clickedElement.current = e.target as HTMLDivElement;
    const type: string = !isMore ? "list" : "more";
    const { object, date, day, week, index } = parameter;
    dispatch(
      modalActions.clickedList({ type, object, date, day, week, index })
    );
  };

  const dateInfo = date.split("-");
  let year: string = dateInfo[0];
  let month: string = dateInfo[1];
  let index: number = 0;

  // array 배열 만들기
  for (const key in schedule[date]) {
    const object = schedule[date][key];

    if (object.startDate < date && day !== "1") continue;

    const isLong: boolean = object.startDate < object.endDate ? true : false;
    let arrayCount: number = 0;
    let barWidth: number =
      object.startDate !== object.endDate
        ? calculateWidth(date, day, object.endDate)
        : 0;
    let thisDate: number = +dateInfo[2];
    let parameter: Parameter = { object, date, week, day, index };

    for (let item of array[+day]) {
      if (arrayCount >= listBoxHeightCount) break;

      if (item) {
        arrayCount += 1;
        continue;
      }

      let isMore = arrayCount < listBoxHeightCount - 1 ? false : true;

      for (let i = +day; i <= 7; i++) {
        if (i === 8) break;

        let date =
          year + "-" + month + "-" + thisDate.toString().padStart(2, "0");

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
              display: i === +day || isMore ? "flex" : "none",
            }}
            onMouseUp={(event: React.MouseEvent) => {
              event.stopPropagation();
              dataClickHandler(event, isMore, parameter);
            }}
            ref={(el: HTMLDivElement) => {
              if (i !== +day) return;
              isMore
                ? (allListRef.current[`${object.key}`] = el)
                : (listRef.current[`${object.key}`] = el);
            }}
            // draggable
            onMouseMove={mousemove}
            onDragStart={dragStartHandler}
            // onDragEnter={}
            // onDrag={dragHanlder}
            // onDragOver={dragOverHandler}
            onDragEnd={dragEndHander}
            onDragLeave={dragLeaveHandler}
          >
            {!isLong && arrayCount < listBoxHeightCount - 1 && (
              <div className={`${object.color} ${classes["color-bar"]}`}></div>
            )}
            <div
              key={object.key}
              className={`${classes.list} ${
                isLong && !isMore && `${classes.long} ${object.color}`
              }`}
              style={{
                backgroundColor:
                  modal.listModalOpen && object.key === modal.key
                    ? "rgba(182, 182, 182, 0.6)"
                    : "",
              }}
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
                  : object.startTime + " " + object.title}
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

  return array[+day];
};

export default Schedule;
