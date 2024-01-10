import React, { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { cloneActions } from "../../redux/clone-slice";
import { DataType, ModalType } from "../../type/ReduxType";
import { ListOrMore } from "../../type/RefType";
import { CalenderData } from "../../type/ReduxType";
import { calculateWidth } from "../../utils/CalculateWidth";
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
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  listViewCount: number;
  setIsDragging: (value: boolean) => void;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
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
  }: T): JSX.Element => {
    const dispatch = useAppDispatch();

    const schedule = data.userSchedule;

    const listElementHeight = window.innerWidth > 500 ? 24 : 20;
    const [countDown, setCountDown] = useState<boolean>(false);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    useEffect(() => {
      // 사용자가 일정이나 날짜를 1초 이상 클릭하고 있는 경우,
      // 드래깅 기능을 활성화
      if (!countDown) return;
      // 사용자가 1초 이상 클릭하고 있는 경우, cloneList 생성
      const checkDragging = () => {
        window.document.body.style.cursor = "move";
        setIsDragging(true);
        setCountDown(false);
      };

      const timeout = setTimeout(checkDragging, 5000);

      return () => clearTimeout(timeout);
    }, [countDown, setIsDragging]);

    const mouseDown = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (window.innerWidth < 500 || param!.key === modal.key) return;
      setX(e.pageX);
      setY(e.pageY);
      setCountDown(true);
      dispatch(cloneActions.setListInfo({ type: "List", ...param }));
    };

    const mouseUp = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (window.innerWidth < 500) return;
      setCountDown(false);
      setIsDragging(false);
      if (param!.key !== modal.key) {
        dispatch(modalActions.setListInfo({ type: "List", ...param }));
        !modal.listModalOpen && dispatch(modalActions.onList());
      }
    };

    const mouseMove = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (e.buttons !== 1) return;
      if (Math.abs(e.pageX - x) > 35 || Math.abs(e.pageY - y) > 35) {
        if (modal.listModalOpen) {
          dispatch(modalActions.clearSet({ type: "list" }));
        }
        dispatch(modalActions.setListInfo({ type: "List", ...param }));
        setCountDown(false);
        setIsDragging(true);
      }
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
      // 화면에 보일 list 개수 저장
      let arrayCount: number = 0;

      for (let item of array[+day]) {
        // 리스트 개수가 화면에 보이는 날짜 칸을 넘어가면 break;
        if (arrayCount >= listViewCount - 1) break;

        if (item) {
          if ((item as React.ReactElement).key === key) {
            return (
              <div className={style["list-box"]}>
                <div className={style["list-area"]}>{array[+day]}</div>
              </div>
            );
          }
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
                object.endDate > object.startDate
                  ? style["bound-long"]
                  : style["short"]
              } `}
              style={{
                width: isLong
                  ? `${calculateWidth(date, +day, object.endDate)}00%`
                  : "98%",
                top: `${listElementHeight * arrayCount}px`,
                display: i === +day ? "flex" : "none",
              }}
              onMouseDown={(e) => mouseDown(e, parameter)}
              onMouseUp={(e) => mouseUp(e, parameter)}
              onMouseMove={(e) => mouseMove(e, parameter)}
              ref={(el: HTMLDivElement) => {
                if (i !== +day) return;
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
                }`}
              >
                <div
                  className={`${style["type-one"]}  ${
                    object.isDone && style.done
                  }`}
                >
                  {!isLong
                    ? object.startTime + " " + object.title
                    : object.title}
                </div>
                <div
                  className={`${style["type-two"]} ${
                    object.isDone && style.done
                  }`}
                >
                  {object.title}
                </div>
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
      <div className={style["list-box"]}>
        <div className={style["list-area"]}>
          {array[+day]}
          {더보기개수 > 0 && (
            <div
              key={`${week} + ${day} `}
              className={`${style["list-boundary"]} ${style["list-more"]}`}
              style={{
                width: "98%",
                top: `${listElementHeight * (listViewCount - 1)}px`,
                display: "flex",
              }}
              onMouseDown={(e) => mouseDownMore(e)}
              onMouseUp={(e) => mouseUpMore(e)}
              ref={(el: HTMLDivElement) => {
                allListRef.current[`${week} + ${day} `] = el;
              }}
            >
              <div className={style.list}>
                <div className={style["type-one"]}>
                  {`${더보기개수}개 더보기`}
                </div>
                <div className={style["type-two"]}>{`+${더보기개수}`}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Schedule;
