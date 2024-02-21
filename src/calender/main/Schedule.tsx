import React, { ReactNode, useRef } from "react";
import { useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { cloneActions } from "../../redux/clone-slice";
import { DataType, ModalType } from "../../type/ReduxType";
import { CalenderData } from "../../type/ReduxType";
import { calculateWidth } from "../../utils/calculateWidth";
import style from "../Calender.module.css";

interface Parameter extends CalenderData {
  date: string;
  day: string;
  week: string;
  index: number;
}

interface T {
  data: DataType;
  modal: ModalType;
  date: string;
  day: string;
  week: string;
  array: ReactNode[][];
  listRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  allListRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  listViewCount: number;
  setIsDragging: (value: boolean) => void;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
  setCountDown: React.Dispatch<React.SetStateAction<boolean>>;
}

const Schedule = React.memo(
  ({
    data,
    modal,
    date,
    day,
    week,
    array,
    listRef,
    allListRef,
    listViewCount,
    setIsDragging,
    clicekdMoreRef,
    setCountDown,
  }: T): JSX.Element => {
    const dispatch = useAppDispatch();

    const schedule = data.userSchedule;
    const 일정막대높이 = window.innerWidth > 500 ? 24 : 20;
    const divRef = useRef<HTMLDivElement>(null);

    const mouseDown = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (window.innerWidth < 500 || param.key === modal.key) return;
      setCountDown(true);
      dispatch(cloneActions.setListInfo({ type: "List", ...param }));
    };

    const mouseUp = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (window.innerWidth < 500) return;
      if (clicekdMoreRef.current) {
        clicekdMoreRef.current = null;
        return;
      }
      setCountDown(false);
      setIsDragging(false);
      dispatch(modalActions.setListInfo({ type: "List", ...param }));
      !modal.listModalOpen && dispatch(modalActions.onModal({ type: "List" }));
    };

    const mouseDownMore = (e: React.MouseEvent) => {
      e.stopPropagation();
      clicekdMoreRef.current = e.target as HTMLDivElement;
    };

    const mouseUpMore = (e: React.MouseEvent) => {
      e.stopPropagation();
      clicekdMoreRef.current = null;
      dispatch(modalActions.clickedMore({ date, day, week }));
    };

    // array 배열 만들기
    for (const key in schedule[date]) {
      const object = schedule[date][key];

      if (object.startDate < date && day !== "1") continue;

      // 긴 일정인지 아닌지
      const isLong: boolean = object.startDate < object.endDate ? true : false;

      let arrayCount: number = 0; // 화면에 보일 list 개수 저장

      for (let item of array[+day]) {
        // 리스트 개수가 화면에 보이는 날짜 칸을 넘어가면 break;
        if (arrayCount >= listViewCount - 1) break;

        if (item) {
          arrayCount += 1;
          continue;
        }

        for (let i = +day; i <= 7; i++) {
          const next: string = new Date(
            new Date(date).getTime() + 24 * 60 * 60 * 1000 * (i - +day)
          )
            .toISOString()
            .split("T")[0];

          if (next > object.endDate) break;

          const parameter: Parameter = {
            ...object,
            date: next,
            day: String(i),
            week,
            index: arrayCount,
          };

          array[i][arrayCount] = (
            <div
              key={object.key}
              className={`${style["list-boundary"]} ${
                object.startDate < object.endDate
                  ? style["bound-long"]
                  : style["short"]
              } `}
              style={{
                width: isLong
                  ? `${calculateWidth(date, +day, object.endDate)}00%`
                  : "98%",
                top: `${일정막대높이 * arrayCount}px`,
                display: i === +day ? "flex" : "none",
              }}
              onMouseDown={(e) => mouseDown(e, parameter)}
              onMouseUp={(e) => mouseUp(e, parameter)}
              ref={(el: HTMLDivElement) => {
                if (i === +day)
                  listRef.current[`${object.key + i + week}`] = el;
              }}
            >
              {!isLong && arrayCount < listViewCount - 1 && (
                <div className={`${object.color} ${style["color-bar"]}`}></div>
              )}
              <div
                key={object.key}
                className={`${style.list} ${
                  isLong &&
                  `${style.long} ${object.color} ${
                    modal.key === object.key ? style.clicked : ""
                  }`
                } ${object.isDone && style.done}`}
              >
                {isLong
                  ? object.title
                  : window.innerWidth > 800
                  ? object.startTime + " " + object.title
                  : object.title}
              </div>
            </div>
          );
        }
        break;
      }
    }

    let viewCount: number = 0;

    for (let i = 0; i < listViewCount - 1; i++) {
      if (array[+day][i]) viewCount++;
    }

    const 더보기개수: number = Object.keys(schedule[date]).length - viewCount;

    return (
      <div className={style["list-box"]} ref={divRef}>
        <div className={style["list-area"]}>
          {array[+day]}
          {더보기개수 > 0 && (
            <div
              key={`${week} + ${day} `}
              className={`${style["list-boundary"]} ${style["list-more"]}`}
              style={{
                width: "98%",
                top: `${일정막대높이 * (listViewCount - 1)}px`,
              }}
              onMouseDown={(e) => mouseDownMore(e)}
              onMouseUp={(e) => mouseUpMore(e)}
              ref={(el: HTMLDivElement) => {
                allListRef.current[`${week} + ${day} `] = el;
              }}
            >
              <div className={style.list}>
                {window.innerWidth > 800
                  ? `${더보기개수}개 더보기`
                  : `+${더보기개수}`}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Schedule;
