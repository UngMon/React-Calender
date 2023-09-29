import React, { ReactNode } from "react";
import { useAppDispatch } from "../redux/store";
import { CalenderData } from "../type/ReduxType";
import { modalActions } from "../redux/modal-slice";
import { ModalType, DataType } from "../type/ReduxType";
import { ListOrMore } from "../type/RefType";
import { calculateWidth } from "../utils/CalculateWidth";
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
  setIsDragging: (value: boolean) => void;
}

interface Parameter {
  object: CalenderData;
  date: string;
  week: string;
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
  setIsDragging,
}: T): JSX.Element => {
  const dispatch = useAppDispatch();
  const schedule = data.userSchedule;
  const listElementHeight = window.innerWidth > 500 ? 24 : 20;

  const listClickHandler = (
    param: Parameter,
    day: string,
    click: string,
    index: number
  ) => {
    dispatch(
      modalActions.clickedList({ type: "List", ...param, day, click, index })
    );
  };

  const mouseDown = (
    e: React.MouseEvent,
    param: Parameter,
    day: string,
    index: number
  ) => {
    console.log("schedule MouseDown");
    let click = "";

    if (clickedElement.current === e.target) {
      click = "same";
      clickedElement.current = null;
    } else {
      click = "no";
      clickedElement.current = e.target as HTMLDivElement;
    }

    listClickHandler(param, day, click, index);
    setIsDragging(true);
  };

  const mouseUp = (
    isMore: boolean,
    param: Parameter,
    day: string,
    index: number
  ) => {
    console.log("schedule mouseUp");
    if (isMore) {
      const [date, week, key] = [param.date, param.week, param.object.key];
      dispatch(modalActions.clickedMore({ date, week, day, key }));
    } else {
      listClickHandler(param, day, "no", index);
      dispatch(modalActions.onList());
      dispatch(modalActions.offMore());
    }
  };

  let index: number = 0;

  // array 배열 만들기
  for (const key in schedule[date]) {
    const object = schedule[date][key];

    if (object.startDate < date && day !== "1") continue;

    // 긴 일정인지 아닌지
    const isLong: boolean = object.startDate < object.endDate ? true : false;
    // 화면에 보일 list 개수 저장
    let arrayCount: number = 0;
    // 긴 일정의 경우 화면에 보일 너비(기간)
    let barWidth: number =
      object.startDate !== object.endDate
        ? calculateWidth(date, +day, object.endDate)
        : 0;

    // modal-slice에 전달할 객체
    let parameter: Parameter = { object, date, week, index };

    for (let item of array[+day]) {
      // 리스트 개수가 화면에 보이는 날짜 칸을 넘어가면 break;
      console.log(arrayCount, listBoxHeightCount)
      if (arrayCount >= listBoxHeightCount) break;
      console.log('자ㄱ동하는기?')
      if (item) {
        arrayCount += 1;
        continue;
      }

      // arraCount가 list.. -1 이 되면 '더 보기'란 생성
      let isMore = arrayCount < listBoxHeightCount - 1 ? false : true;

      for (let i = +day; i <= 7; i++) {
        if (i === 8) break;

        let next: string;

        const currentDate = new Date(date);

        const previousDate = new Date(
          currentDate.getTime() + 24 * 60 * 60 * 1000 * (i - +day)
        );
        next = previousDate.toISOString().split("T")[0];

        if (next > object.endDate) break;

        const index = arrayCount;
        console.log('자ㄱ동하는기?')
        array[i][arrayCount] = (
          <div
            key={object.key}
            className={`${
              !isMore
                ? object.endDate > object.startDate
                  ? classes["list-boundary-long"]
                  : classes["list-boundary-short"]
                : classes["list-more"]
            }`}
            style={{
              width: isLong && !isMore ? `${barWidth}00%` : "98%",
              top: `${listElementHeight * arrayCount}px`,
              display: i === +day || isMore ? "flex" : "none",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (window.innerWidth < 500) return;
              if (modal.moreModalOpen || isMore) return;
              mouseDown(e, parameter, String(i), index);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              if (window.innerWidth < 500) return;
              mouseUp(isMore, parameter, String(i), index);
            }}
            ref={(el: HTMLDivElement) => {
              if (i !== +day && !isMore) return;
              isMore
                ? (allListRef.current[`${object.key + i + week}`] = el)
                : (listRef.current[`${object.key + i + week}`] = el);
            }}
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
                  : object.startDate === object.endDate
                  ? object.startTime + " " + object.title
                  : object.title}
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
                  : object.title}
              </div>
            </div>
          </div>
        );
      }
      break;
    }

    index += 1;
  }

  return (
    <div className={classes["list-box"]}>
      <div className={classes["list-area"]}>{array[+day]}</div>
    </div>
  );
};

export default Schedule;
