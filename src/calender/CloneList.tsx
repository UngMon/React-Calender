import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { sendUserData } from "../redux/fetch-action";
import { useNavigate } from "react-router-dom";
import { ModalType, DataType, UserData } from "../type/ReduxType";
import { MakeListParameter } from "../type/Etc";
import { MakeList } from "../utils/MakeList";
import { calculateWidth } from "../utils/CalculateWidth";
import classes from "./MakeCalender.module.css";
import MakeLongArr from "../utils/MakeLongArr";

interface T {
  year: string;
  month: string;
  data: DataType;
  modal: ModalType;
  firstDay: number;
  lastWeek: number;
  uid: string;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<HTMLDivElement>;
}

const CloneList = ({
  year,
  month,
  data,
  modal,
  firstDay,
  lastWeek,
  uid,
  isDragging,
  setIsDragging,
  clickedElement,
  viewRef,
}: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [고정좌표, 고정좌표설정] = useState<[number, number]>([0, 0]);
  const [실시간좌표, 실시간좌표설정] = useState<[number, number]>([0, 0]);

  const [enter, setEnter] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>(modal.startDate);
  const [endDate, setEndDate] = useState<string>(modal.endDate);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const moveDate = useCallback((date: string, move: number) => {
    const currentDate = new Date(date);

    // 1일을 밀리초 단위로 나타내는 상수
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000 * move;

    // 현재 날짜에서 하루 전 날짜를 계산
    const previousDate = new Date(currentDate.getTime() + oneDayInMilliseconds);

    // 이전 날짜를 문자열로 변환. (예: "2023-08-11")
    const previousDateFormatted = previousDate.toISOString().split("T")[0];

    return previousDateFormatted;
  }, []);

  useEffect(() => {
    if (!enter && modal.mouseType === "MakeList") return;
    if (!modal.startDate || !modal.endDate) return;
    if (고정좌표[0] === 0 && 고정좌표[1] === 0) return;
    const move: number =
      (실시간좌표[1] - 고정좌표[1]) * 7 + (실시간좌표[0] - 고정좌표[0]);
    let start: string;
    let end: string;

    if (modal.mouseType === "MakeList") {
      start = move >= 0 ? modal.startDate : moveDate(modal.startDate, move);
      end = move >= 0 ? moveDate(modal.endDate, move) : endDate;
    } else if (modal.mouseType === "List") {
      start = moveDate(modal.startDate, move);
      end = moveDate(modal.endDate, move);
    } else {
      start = modal.startDate;
      end = modal.endDate;
    }

    setStartDate(start);
    setEndDate(end);
    setEnter(false);
  }, [moveDate, modal, 고정좌표, 실시간좌표, startDate, endDate, enter]);

  const mouseEnter = (day: number, week: number) => {
    if (modal.addModalOpen) return;
    실시간좌표설정([day, week]);
    setEnter(true);
    고정좌표[0] === 0 && 고정좌표설정([day, week]);
  };

  const mouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`mouseUp ${isDragging}`);
    document.body.style.cursor = "auto";

    const dateArray = MakeLongArr(startDate.split("-"), endDate.split("-"));

    if (modal.mouseType === "MakeList") {
      if (viewRef.current!.clientWidth <= 500) navigate("/calender/makeEvent");
      else dispatch(modalActions.onAdd());

      if (실시간좌표[0] === 고정좌표[0] && 실시간좌표[1] === 고정좌표[1])
        return;

      let day = 0;
      let week = 0;
      const type = "MakeList";

      switch (true) {
        case 실시간좌표[1] > 고정좌표[1]:
          day = 고정좌표[0];
          week = 고정좌표[1];
          break;
        case 실시간좌표[1] === 고정좌표[1]:
          day = 실시간좌표[0] < 고정좌표[0] ? 실시간좌표[0] : 고정좌표[0];
          week = 고정좌표[1];
          break;
        default:
          day = 실시간좌표[0];
          week = 실시간좌표[1];
      }

      dispatch(
        modalActions.clickedDate({
          type,
          startDate,
          endDate,
          day: String(day),
          week: String(week),
          dateArray,
        })
      );
    }

    if (modal.mouseType === "List") {
      setIsMoving(false);
      setIsDragging(false);
      if (실시간좌표[0] === 고정좌표[0] && 실시간좌표[1] === 고정좌표[1]) {
        if (isMoving) {
          clickedElement.current = null;
          return;
        }

        if (modal.click === "same") {
          dispatch(modalActions.offList());
        } else {
          dispatch(modalActions.onList());
        }
        return;
      }

      const schedule = JSON.parse(JSON.stringify(data.userSchedule));
      const prevDateArray = MakeLongArr(
        modal.startDate.split("-"),
        modal.endDate.split("-")
      );
      // 기존 항목 삭제 하고..
      for (let date of prevDateArray) {
        delete schedule[date][modal.key];
      }

      const parameter: MakeListParameter = {
        title: modal.title,
        startDate,
        endDate,
        startTime: modal.startTime,
        endTime: modal.endTime,
        color: modal.color,
        dateArray,
        userSchedule: schedule,
      };
      // 새롭게 설정된 기간에 일정 생성 후에
      const newSchedule: UserData = MakeList(parameter);
      // 데이터 전송
      dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
    }
  };

  const mouseMove = () => {
    // 모달창이 열려있으면 마우스 커서 icon을 기본으로, move이벤트 발생 x
    if (modal.addModalOpen || isMoving) return;
    setIsMoving(true);
    modal.listModalOpen && dispatch(modalActions.offList());
    document.body.style.cursor = "move";
  };

  const scheduleHandler = (date: string, day: number) => {
    if (!startDate || !endDate) return;
    if (date < startDate! || endDate! < date) return;
    if (day !== 1 && date !== startDate) return;

    let barWidth: number =
      startDate! < endDate! ? calculateWidth(date, day, endDate!) : 1;
    const isLong = startDate !== endDate ? true : false;

    return (
      <div
        className={classes["list-boundary-long"]}
        style={{
          width: `${barWidth}00%`,
          top: `1px`,
          opacity: "0.9",
        }}
      >
        <div
          className={`${classes.list}
          ${classes.long} ${modal.color || "라벤더"}`}
        >
          <div
            className={`${classes["type-one"]} ${modal.isDone && classes.done}`}
          >
            {!isLong ? modal.startTime + " " + modal.title : modal.title}
          </div>
        </div>
      </div>
    );
  };

  const dateArray: React.ReactNode[] = [];

  // /* 날짜 생성하기 */
  const makeDay = (주: number) => {
    const thisMonthArray = [];

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

      thisMonthArray.push(
        <td
          key={date}
          className={classes.date_box}
          onMouseEnter={() => mouseEnter(i, 주)}
          onMouseUp={(e) => mouseUp(e)}
          onMouseMove={mouseMove}
        >
          <div className={classes["list-box"]}>
            <div className={classes["list-area"]}>
              {scheduleHandler(date, i)}
            </div>
          </div>
        </td>
      );
    }
    return thisMonthArray;
  };

  for (let i = 1; i <= lastWeek; i++) {
    dateArray.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i)}
      </tr>
    );
  }

  return (
    <div
      className={classes.calender}
      style={{
        position: "absolute",
        top: "0px",
        zIndex: 5,
        height: "calc(100vh - 80px)",
      }}
    >
      <table className={classes.table}>
        <thead className={classes.weekname}>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className={classes.presentation}>{dateArray}</tbody>
      </table>
    </div>
  );
};

export default CloneList;
