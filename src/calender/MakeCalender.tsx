import React, { ReactNode, useEffect, useState } from "react";
import { CalenderData, DataType, ModalType } from "../utils/ReduxType";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { dataActions } from "../redux/data-slice";
import { ListOrMore } from "../utils/RefType";
import MakeIdx from "../library/MakeIdx";
import classes from "./MakeCalender.module.css";

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

  const schedule = data.userSchedule;
  const addModalOpen = data.addModalOpen;

  useEffect(() => {
    // 컴포넌트의 return 실행 후, state에 값을 저장후 랜더링
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
    const type = "add";
    if (!addModalOpen) {
      dispatch(
        dataActions.clickedDate({ type, idx, day, week, dateArray: [idx] })
      );
    }
  };

  const dataClickHandler = (
    e: React.MouseEvent,
    isMore: boolean,
    parameter: Parameter
  ) => {
    clickedElement.current = e.target as HTMLDivElement;
    let type: string = isMore ? "list" : "more";
    dispatch(modalActions.clickedList({ type, parameter }));
  };

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

  const scheduleHandler = (
    date: string,
    day: string,
    week: string,
    array: ReactNode[][]
  ) => {
    if (!schedule[date]) return;

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
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                dataClickHandler(event, isMore, parameter);
              }}
              ref={(el: HTMLDivElement) => {
                isMore
                  ? (allListRef.current[`${object.key}`] = el)
                  : (listRef.current[`${object.key}`] = el);
              }}
            >
              {!isLong && arrayCount < listBoxHeightCount - 1 && (
                <div
                  className={`${object.color} ${classes["color-bar"]}`}
                ></div>
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

  const dateArray: React.ReactNode[] = [];

  // ////////////////////////////////////////////////
  let sunday: number = 0;
  // /* 날짜 생성하기 */
  const makeDay = (week: number, array: ReactNode[][]) => {
    const thisMonthArray = [];

    let date: number = 0;
    let idx: string = "";
    let isNext = false;

    for (let i = 1; i <= 7; i++) {
      if (week === 1) {
        if (i <= firstDay) {
          const prevMonthLastDate = new Date(+year, +month - 1, 0).getDate();
          date = prevMonthLastDate - firstDay + i;
          idx = MakeIdx("prev", year, month, date);
        } else {
          date = i - firstDay;
          idx = MakeIdx("", year, month, date);
        }
      } else {
        if (sunday + i > lastDate) {
          sunday = 0;
          sunday += 1;
          date = sunday;
          isNext = true;
          idx = MakeIdx("next", year, month, date);
        } else {
          date = !isNext ? sunday + i : date + 1;
          idx = MakeIdx("", year, month, date);
        }
      }

      if (i === 7 && sunday <= lastDate) sunday = date;

      thisMonthArray.push(
        <td
          key={idx}
          // eslint-disable-next-line no-loop-func
          onClick={() => {
            !modal.listModalOpen &&
              addClickHandler(idx, i.toString(), week.toString());
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
                {date === 1
                  ? isNext
                    ? `${+month + 1}월 1일`
                    : `${+month}월 1일`
                  : date}
              </h2>
            </div>
          </div>
          <div className={classes["list-box"]}>
            <div className={classes["list-area"]}>
              {scheduleHandler(idx, i.toString(), week.toString(), array)}
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
