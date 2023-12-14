import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { cloneActions } from "../../redux/clone-slice";
import { ListOrMore } from "../../type/RefType";
import { basicHolidayObject } from "../../utils/holiday";
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
  year: string;
  month: string;
  week: number;
  firstDay: number;
  isScroling: boolean; // 좌, 우 움직이는
  setIsDragging: (value: boolean) => void; // 드래고 일정 생성할지 안 할지
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
  listViewCount: number;
}

const MakeCalender = React.memo(
  ({
    year,
    month,
    week,
    firstDay,
    isScroling,
    setIsDragging,
    listRef,
    allListRef,
    clicekdMoreRef,
    listViewCount
  }: T) => {
    const dispatch = useAppDispatch();
    const data = useSelector((state: RootState) => state.data);

    const [countDown, setCountDown] = useState<boolean>(false);

    let dateElements: React.ReactNode[] = [];


    useEffect(() => {
      // 사용자가 일정이나 날짜를 1초 이상 클릭하고 있는 경우, 드래깅 기능을 활성화
      if (!countDown) return;
      // 사용자가 1초 이상 클릭하고 있는 경우, cloneList 생성
      const checkDragging = () => setIsDragging(true);

      const timeout = setTimeout(checkDragging, 1000);

      return () => clearTimeout(timeout);
    }, [countDown, setIsDragging]);

    const mouseDown = (day: string, week: string, date: string) => {
      if (window.innerWidth < 500) return;
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
      setCountDown(false); // 카운트다운 취소
      if (clicekdMoreRef.current) return;
      setIsDragging(true); // 마우스 up후에 clone List가 보이게 true로 설정
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

        const [년, 월, 일] = date.split("-");
        const isHoliday =
          basicHolidayObject[월 + 일] || data.holiday[년]?.[년 + 월 + 일];
        const day = String(i);
        const week = String(주);

        thisWeekArray.push(
          <td
            key={date}
            onMouseDown={() => mouseDown(day, week, date)}
            onMouseUp={() => mouseUp()}
            onMouseMove={(e) => mouseMove(e)}
            onTouchEnd={() => touchEndHandler(day, week, date)}
          >
            <div
              className={`${style[`date-box`]} ${i === 1 && style.startDate}`}
            >
              <span
                className={`${i === 1 && style.sunday} 
                    ${i === 7 && style.saturday} ${
                  identify === date && style.Today
                }
                  ${isHoliday && style.sunday}
                  `}
              >
                {일 === "01" ? `${+월}월 1일` : +일}
              </span>
              {isHoliday && (
                <span className={style.sunday}>{isHoliday.dateName}</span>
              )}
            </div>
            {data.userSchedule[date] && (
              <Schedule
                date={date}
                day={day}
                week={week}
                array={array}
                data={data}
                listRef={listRef}
                allListRef={allListRef}
                listViewCount={listViewCount}
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
