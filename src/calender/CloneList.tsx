import React, { useCallback, useEffect, useState } from "react";
import { auth } from "../Auth/firebase";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { cloneActions } from "../redux/clone-slice";
import { modalActions } from "../redux/modal-slice";
import { sendUserData } from "../redux/fetch-action";
import { useNavigate } from "react-router-dom";
import { UserData } from "../type/ReduxType";
import { MakeListParameter } from "../type/Etc";
import { MakeList } from "../utils/MakeList";
import { calculateWidth } from "../utils/CalculateWidth";
import { makeDateArray } from "../utils/MakeLongArr";
import style from "./Calender.module.css";

interface T {
  year: string;
  month: string;
  firstDay: number;
  lastWeek: number;
  setIsDragging: (value: boolean) => void;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<HTMLDivElement>;
}

const CloneList = ({
  year,
  month,
  firstDay,
  lastWeek,
  setIsDragging,
  clickedElement,
  viewRef,
}: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);
  const clone = useSelector((state: RootState) => state.clone);

  const uid = auth.currentUser!.uid;
  const [고정좌표, 고정좌표설정] = useState<[number, number]>([0, 0]);
  const [실시간좌표, 실시간좌표설정] = useState<[number, number]>([0, 0]);

  const [mouseEnter, setMouseEnter] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(clone.startDate);
  const [endDate, setEndDate] = useState<string>(clone.endDate);

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
    if (!clone.startDate || !clone.endDate) return;
    if (!mouseEnter && clone.mouseType === "MakeList") return;

    const move: number =
      (실시간좌표[1] - 고정좌표[1]) * 7 + (실시간좌표[0] - 고정좌표[0]);
    let start: string;
    let end: string;

    if (clone.mouseType === "MakeList") {
      start = move >= 0 ? clone.startDate : moveDate(clone.startDate, move);
      end = move >= 0 ? moveDate(clone.endDate, move) : clone.endDate;
    } else if (clone.mouseType === "List") {
      start = moveDate(clone.startDate, move);
      end = moveDate(clone.endDate, move);
    } else {
      start = clone.startDate;
      end = clone.endDate;
    }

    setStartDate(start);
    setEndDate(end);
    setMouseEnter(false);
  }, [moveDate, clone, 고정좌표, 실시간좌표, mouseEnter]);

  const mouseEnterHandler = (day: number, week: number) => {
    if (modal.addModalOpen || modal.openEdit) return;
    if (고정좌표[0] === 0) 고정좌표설정([day, week]);
    실시간좌표설정([day, week]);
    setMouseEnter(true);
  };

  const mouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickedElement.current = null;
    if (modal.openEdit) {
      dispatch(modalActions.clearSet({ type: "all" }));
      setIsDragging(false);
      return;
    }

    document.body.style.cursor = "auto";

    if (clone.mouseType === "MakeList") {
      if (viewRef.current!.clientWidth <= 500) navigate("/calender/makeEvent");
      else
        !modal.addModalOpen &&
          dispatch(modalActions.onOffModal({ type: "make" }));

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
        cloneActions.clickedDate({
          type,
          startDate,
          endDate,
          day: String(day),
          week: String(week),
        })
      );
      return;
    }

    if (clone.mouseType === "List") {
      setIsMoving(false);
      setIsDragging(false);
      if (실시간좌표[0] === 고정좌표[0] && 실시간좌표[1] === 고정좌표[1]) {
        dispatch(cloneActions.clearSet());
        dispatch(modalActions.clearSet({ type: "all" }));
        return;
      }

      const schedule = JSON.parse(JSON.stringify(data.userSchedule));
      const prevDateArray = makeDateArray(clone.startDate, clone.endDate);
      // 기존 항목 삭제 하고..
      for (let date of prevDateArray) {
        delete schedule[date][clone.key];
      }

      const parameter: MakeListParameter = {
        title: clone.title,
        startDate,
        endDate,
        startTime: clone.startTime,
        endTime: clone.endTime,
        color: clone.color,
        userSchedule: schedule,
      };
      // 새롭게 설정된 기간에 일정 생성 후에
      const newSchedule: UserData = MakeList(parameter);
      // 데이터 전송
      dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
      dispatch(cloneActions.clearSet());
      dispatch(modalActions.clearSet({ type: "all" }));
    }
  };

  const mouseMove = () => {
    // 모달창이 열려있으면 마우스 커서 icon을 기본으로, move이벤트 발생 x
    if (modal.addModalOpen || isMoving || modal.openEdit) return;
    setIsMoving(true);
    modal.listModalOpen && dispatch(modalActions.clearSet({ type: "all" }));
    document.body.style.cursor = "move";
  };

  const scheduleHandler = (date: string, day: number) => {
    if (!startDate || !endDate) return;

    if (date < startDate || endDate < date) return;

    if (day !== 1 && date !== startDate) return;

    let barWidth: number =
      startDate < endDate ? calculateWidth(date, day, endDate) : 1;

    const isLong = startDate !== endDate ? true : false;
    const title =
      modal.mouseType === "MakeList"
        ? " "
        : !isLong
        ? modal.startTime + " " + modal.title
        : modal.title;

    return (
      <div
        className={style["list-boundary-long"]}
        style={{
          width: `${barWidth}00%`,
          top: `1.5px`,
        }}
      >
        <div
          className={`${style.list}
          ${style.long} ${clone.color || modal.color || "라벤더"}`}
        >
          <div className={`${style["type-one"]} ${modal.isDone && style.done}`}>
            {title}
          </div>
        </div>
      </div>
    );
  };

  const dateElements: React.ReactNode[] = [];

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
          className={style.date_box}
          onMouseEnter={() => mouseEnterHandler(i, 주)}
          onMouseUp={(e) => mouseUp(e)}
          onMouseMove={mouseMove}
        >
          <div className={style["list-box"]}>
            <div className={style["list-area"]}>{scheduleHandler(date, i)}</div>
          </div>
        </td>
      );
    }
    return thisMonthArray;
  };

  for (let i = 1; i <= lastWeek; i++) {
    dateElements.push(
      <tr key={i} className={`week ${i}`}>
        {makeDay(i)}
      </tr>
    );
  }

  return (
    <div
      className={style.calender}
      style={{
        position: "absolute",
        top: "0px",
        zIndex: 5,
        height: "calc(100vh - 80px)",
      }}
    >
      <table className={style.table}>
        <thead className={style.weekname}>
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
        <tbody className={style.presentation}>{dateElements}</tbody>
      </table>
    </div>
  );
};

export default CloneList;
