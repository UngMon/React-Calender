import React, { ReactNode, useEffect, useState } from "react";
import { DataType, ModalType } from "../../type/ReduxType";
import { useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { cloneActions } from "../../redux/clone-slice";
import { ListOrMore } from "../../type/RefType";
import Schedule from "./Schedule";
import style from "../Calender.module.css";

const date: Date = new Date();
const fixYear: number = date.getFullYear();
const fixMonth: number = date.getMonth() + 1;
const fixDate: number = date.getDate();

const identify: string =
  fixYear +
  "-" +
  fixMonth.toString().padStart(2, "0") +
  "-" +
  fixDate.toString().padStart(2, "0");

interface T {
  data: DataType;
  modal: ModalType;
  year: string;
  month: string;
  week: number;
  firstDay: number;
  isScroling: boolean; // 좌, 우 움직이는
  setIsDragging: (value: boolean) => void;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MakeCalender = React.memo(
  ({
    data,
    modal,
    year,
    month,
    week,
    firstDay,
    isScroling,
    setIsDragging,
    viewRef,
    listRef,
    allListRef,
    clicekdMoreRef,
  }: T) => {
    const dispatch = useAppDispatch();
    const [listBoxHeightCount, setCount] = useState<number>(0);
    const [countDown, setCountDown] = useState<boolean>(false);

    let dateElements: React.ReactNode[] = [];

    useEffect(() => {
      // 마운트 이후, state에 값을 저장후 랜더링
      let elementHeight = window.innerWidth > 500 ? 24 : 20; // 일정 막대기 높이
      setCount(
        Math.floor(
          ((viewRef.current!.clientHeight - 26) / week - 24) / elementHeight
        )
      );
    }, [viewRef, week]);

    useEffect(() => {
      const getListBoxSize = () => {
        let elementHeight = window.innerWidth > 500 ? 24 : 20; // 일정 막대기 높이
        setCount(
          Math.floor(
            ((viewRef.current!.clientHeight - 26) / week - 24) / elementHeight
          )
        );

        if (window.innerWidth <= 500) {
          // mobile영역으로 사이즈가 줄어들면 pc 모달창 지우기 및 clone 삭제
          if (modal.addModalOpen || modal.listModalOpen || modal.moreModalOpen)
            dispatch(modalActions.clearSet());

          setIsDragging(false);
        } else {
          if (modal.mobileModalOpen)
            dispatch(modalActions.onOffModal({ type: "mobile" }));
        }
      };
      // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.
      window.addEventListener("resize", getListBoxSize);

      return () => window.removeEventListener("resize", getListBoxSize);
    });

    useEffect(() => {
      // 사용자가 일정이나 날짜를 1초 이상 클릭하고 있는 경우,
      // 드래깅 기능을 활성화 시킬지 안 할지 결정한다.

      if (modal.addModalOpen) setCountDown(false);
      if (!countDown) return;

      // 사용자가 1초 이상 클릭하고 있는 경우, cloneList 생성
      const checkDragging = () => setIsDragging(true);

      const timeout = setTimeout(checkDragging, 1000);

      return () => clearTimeout(timeout);
    }, [modal.addModalOpen, countDown, setIsDragging]);

    const mouseDown = (day: string, week: string, date: string) => {
      if (window.innerWidth < 500) return;
      if (modal.addModalOpen || modal.listModalOpen || modal.moreModalOpen)
        return;

      const type = "MakeList";
      const [startDate, endDate] = [date, date];
      setCountDown(true);
      dispatch(
        cloneActions.clickedDate({ type, startDate, endDate, day, week })
      );
    };

    const mouseMove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (clicekdMoreRef.current || e.buttons !== 1) return;
      setCountDown(false);
      setIsDragging(true);
    };

    const mouseUp = () => {
      setCountDown(false);
      if (clicekdMoreRef.current) return;
      if (modal.addModalOpen || modal.listModalOpen || modal.moreModalOpen)
        return;
      setIsDragging(true);
      dispatch(modalActions.onOffModal({ type: "make" }));
    };

    const touchEndHandler = (day: string, week: string, date: string) => {
      if (window.innerWidth > 500 || isScroling) return;
      const type = "MakeList";
      const [startDate, endDate] = [date, date];
      dispatch(
        cloneActions.clickedDate({ type, startDate, endDate, day, week })
      );
      dispatch(modalActions.toggleMobilModal());
    };

    /* 날짜 생성하기 */
    const makeDay = (주: number, array: ReactNode[][]) => {
      const thisWeekArray = [];

      let move: number;

      if (주 === 1) move = -24 * 60 * 60 * 1000 * firstDay;
      else move = 24 * 60 * 60 * 1000 * ((주 - 2) * 7 + (7 - firstDay));

      const thisDate = new Date(new Date(+year, +month - 1, 1).getTime() + move)
        .toISOString()
        .split("T")[0];

      for (let i = 1; i <= 7; i++) {
        let next: number = i * 24 * 60 * 60 * 1000;
        const date = new Date(new Date(thisDate).getTime() + next)
          .toISOString()
          .split("T")[0];

        const [_, 월, 일] = date.split("-");

        const day = String(i);
        const week = String(주);

        thisWeekArray.push(
          <td
            key={date}
            onMouseDown={() => mouseDown(day, week, date)}
            onMouseUp={mouseUp}
            onMouseMove={(e) => mouseMove(e)}
            onTouchEnd={() => touchEndHandler(day, week, date)}
            className={style.date_box}
          >
            <div className={style.date}>
              <div
                className={`${style["date-h"]}  ${
                  일 === "01" && style.startDate
                }`}
              >
                <h2
                  className={`${i === 1 && style.sunday} 
                    ${i === 7 && style.saturday} ${
                    identify === date && style.Today
                  }
                  `}
                >
                  {일 === "01" ? `${+월}월 1일` : +일}
                </h2>
              </div>
            </div>
            {data.userSchedule[date] && (
              <Schedule
                date={date}
                day={day}
                week={week}
                array={array}
                data={data}
                modal={modal}
                listRef={listRef}
                allListRef={allListRef}
                listBoxHeightCount={listBoxHeightCount}
                setIsDragging={setIsDragging}
                clicekdMoreRef={clicekdMoreRef}
              />
            )}
          </td>
        );
      }
      return thisWeekArray;
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

      dateElements.push(
        <tr key={i} className={`week ${i}`}>
          {makeDay(i, array)}
        </tr>
      );
    }

    return (
      <table className={style.table}>
        <thead className={style.weekname}>
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
        <tbody className={style.presentation}>{dateElements}</tbody>
      </table>
    );
  }
);

export default MakeCalender;
