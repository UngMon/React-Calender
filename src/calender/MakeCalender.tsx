import React, { ReactNode, useEffect, useState } from "react";
import { DataType, ModalType } from "../type/ReduxType";
import { useAppDispatch } from "../redux/store";
import { dataActions } from "../redux/data-slice";
import { ListOrMore } from "../type/RefType";
import MakeIdx from "../utils/MakeIdx";
import classes from "./MakeCalender.module.css";
import Schedule from "./Schedule";
import { modalActions } from "../redux/modal-slice";

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
  lastDate: number;
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
  lastDate,
  isDragging,
  setIsDragging,
  viewRef,
  listRef,
  allListRef,
  clickedElement,
  data,
  modal,
}: T): React.ReactNode => {
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
  });

  const mouseDown = (day: string, week: string, date: string) => {
    console.log("Make Down");
    document.body.style.cursor = "move";
    setIsDragging(true);
    dispatch(modalActions.mouseMove({ type: "MakeList", day, week, date }));
  };

  const addClickHandler = (idx: string, day: string, week: string) => {
    if (modal.listModalOpen || modal.moreModalOpen) return;
    const type = "add";

    if (!data.addModalOpen) {
      dispatch(
        dataActions.clickedDate({ type, idx, day, week, dateArray: [idx] })
      );
    }
  };

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
          thisDate = sunday + i - lastDate;
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
          onMouseUp={() => {
            console.log('Make mouseUp')
            !isDragging && addClickHandler(idx, i.toString(), 주.toString());
            isDragging && setIsDragging(false);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            mouseDown(day, week, date);
          }}
          className={classes.date_box}
          day-index={i}
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
                isDragging,
                setIsDragging,
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

  return <tbody className={classes.presentation}>{dateArray}</tbody>;
};

export default MakeCalender;
