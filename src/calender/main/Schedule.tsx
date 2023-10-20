import React, { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { cloneActions } from "../../redux/clone-slice";
import { ModalType, DataType } from "../../type/ReduxType";
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
  listBoxHeightCount: number;
  setIsDragging: (value: boolean) => void;
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
    listBoxHeightCount,
    setIsDragging,
  }: T): JSX.Element => {
    const dispatch = useAppDispatch();
    const schedule = data.userSchedule;

    const listElementHeight = window.innerWidth > 500 ? 24 : 20;
    const [countDown, setCountDown] = useState<boolean>(false);

    useEffect(() => {
      // 사용자가 일정이나 날짜를 1초 이상 클릭하고 있는 경우,
      // 드래깅 기능을 활성화 시킬지 안 할지 결정한다.
      if (!countDown) return;
      // 사용자가 1초 이상 클릭하고 있는 경우, cloneList 생성
      const checkDragging = () => {
        window.document.body.style.cursor = "move";
        setIsDragging(true);
      };

      const timeout = setTimeout(checkDragging, 800);

      return () => clearTimeout(timeout);
    }, [countDown, setIsDragging]);

    const setListInfoHandler = (param: Parameter, click: string) => {
      dispatch(modalActions.setListInfo({ type: "List", ...param, click }));
    };

    const mouseDown = (
      e: React.MouseEvent<HTMLDivElement>,
      isMore: boolean,
      param: Parameter
    ) => {
      e.stopPropagation();
      if (window.innerWidth < 500 || param.key === modal.key) return;
      if (modal.moreModalOpen || isMore) return;
      // console.log(" Schedule MouseDown");
      setCountDown(true);
      dispatch(
        cloneActions.setListInfo({ type: "List", ...param, click: "no" })
      );
    };

    const mouseUp = (
      e: React.MouseEvent,
      isMore: boolean,
      param: Parameter
    ) => {
      e.stopPropagation();
      if (window.innerWidth < 500) return;

      if (isMore) dispatch(modalActions.clickedMore({ ...param }));

      setCountDown(false);
      setIsDragging(false);

      if (!isMore && param.key !== modal.key) {
        setListInfoHandler(param, "no");
        !modal.addModalOpen && dispatch(modalActions.onList());
      }
    };

    const mouseMove = (e: React.MouseEvent, param: Parameter) => {
      e.stopPropagation();
      if (e.buttons !== 1) return;
      if (modal.listModalOpen) dispatch(modalActions.clearSet());
      // console.log("Schedule MouseMove");
      setListInfoHandler(param, "no");
      setCountDown(false);
      setIsDragging(true);
    };

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

      for (let item of array[+day]) {
        // 리스트 개수가 화면에 보이는 날짜 칸을 넘어가면 break;

        if (arrayCount >= listBoxHeightCount) break;

        if (item) {
          if ((item as React.ReactElement).key === key)
            return (
              <div className={style["list-box"]}>
                <div className={style["list-area"]}>{array[+day]}</div>
              </div>
            );
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
              className={`${
                !isMore
                  ? object.endDate > object.startDate
                    ? style["list-boundary-long"]
                    : style["list-boundary-short"]
                  : style["list-more"]
              } `}
              style={{
                width: isLong && !isMore ? `${barWidth}00%` : "98%",
                top: `${listElementHeight * arrayCount}px`,
                display: i === +day || isMore ? "flex" : "none",
              }}
              onMouseDown={(e) => mouseDown(e, isMore, parameter)}
              onMouseUp={(e) => mouseUp(e, isMore, parameter)}
              onMouseMove={(e) => mouseMove(e, parameter)}
              ref={(el: HTMLDivElement) => {
                if (i !== +day && !isMore) return;
                isMore
                  ? (allListRef.current[`${object.key + i + week}`] = el)
                  : (listRef.current[`${object.key + i + week}`] = el);
              }}
            >
              {!isLong && arrayCount < listBoxHeightCount - 1 && (
                <div className={`${object.color} ${style["color-bar"]}`}></div>
              )}
              <div
                key={object.key}
                className={`${style.list} ${
                  isLong &&
                  !isMore &&
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
                  className={`${style["type-two"]} ${
                    object.isDone && style.done
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
    }

    return (
      <div className={style["list-box"]}>
        <div className={style["list-area"]}>{array[+day]}</div>
      </div>
    );
  }
);

export default Schedule;
