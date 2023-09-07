import React, { ReactNode, useEffect, useState } from "react";
import { DataType, ModalType } from "../type/ReduxType";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { ListOrMore } from "../type/RefType";
import Schedule from "./Schedule";
import classes from "./MakeCalender.module.css";

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
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  data: DataType;
  modal: ModalType;
}

const MakeCalender = ({
  year,
  month,
  week,
  firstDay,
  isDragging,
  setIsDragging,
  viewRef,
  listRef,
  allListRef,
  clickedElement,
  data,
  modal,
}: T) => {
  console.log("MakeCalender");
  const dispatch = useAppDispatch();
  const [listBoxHeightCount, setHeight] = useState<number>(0);

  useEffect(() => {
    // 마운트 이후, state에 값을 저장후 랜더링
    setHeight(
      Math.floor((viewRef.current!.clientHeight - 45 - 24 * week) / (24 * week))
    );
  }, [viewRef, week]);

  useEffect(() => {
    const getListBoxSize = () => {
      setHeight(
        Math.floor(
          (viewRef.current!.clientHeight - 45 - 24 * week) / (24 * week)
        )
      );
    };
    // 창 크기 조절시에 보이는 list 개수 달리 보여주기 위함.
    window.addEventListener("resize", getListBoxSize);

    return () => window.removeEventListener("resize", getListBoxSize);
  });

  const mouseDown = (day: string, week: string, date: string) => {
    if (modal.listModalOpen || modal.moreModalOpen) return;
    if (isDragging) return;
    console.log("Make Down");
    const type = "MakeList";
    const [startDate, endDate] = [date, date];
    setIsDragging(true);
    dispatch(modalActions.clickedDate({ type, startDate, endDate, day, week }));
  };

  const dateArray: React.ReactNode[] = [];

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
          onMouseDown={() => {
            mouseDown(day, week, date);
          }}
          className={classes.date_box}
          day-index={i}
        >
          <div className={classes.date}>
            <div className={classes["date-h"]}>
              <h2
                className={`${
                  i === 1 ? classes.sunday : i === 7 && classes.saturday
                } ${identify === date && classes.Today}`}
              >
                {일 === "01" ? `${+월}월 1일` : +일}
              </h2>
            </div>
          </div>
          <Schedule
            date={date}
            day={day}
            week={week}
            array={array}
            data={data}
            modal={modal}
            listRef={listRef}
            allListRef={allListRef}
            clickedElement={clickedElement}
            listBoxHeightCount={listBoxHeightCount}
            setIsDragging={setIsDragging}
          />
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

    dateArray.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i, array)}
      </tr>
    );
  }

  return <tbody className={classes.presentation}>{dateArray}</tbody>;
};

export default MakeCalender;
