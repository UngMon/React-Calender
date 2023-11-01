import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { cloneActions } from "../redux/clone-slice";
import { ListOrMore } from "../type/RefType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CalenderData } from "../type/ReduxType";
import ModalPositionTwo from "../utils/ModalPositionTwo";
import "./MoreList.css";

interface T {
  viewRef: React.RefObject<HTMLDivElement>;
  moreModalRef: React.MutableRefObject<HTMLDivElement | null>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  list: React.RefObject<HTMLDivElement>;
}

const widthObj: { [key: string]: string } = {
  short: "194px",
  middle: "182px",
  start: "170.2px",
  end: "170.2px",
};

const marginLeft: { [key: string]: string } = {
  short: "0px",
  middle: "10.909px",
  start: "0px",
  end: "10.909px",
};

const dayText: { [key: string]: string } = {
  "1": "일",
  "2": "월",
  "3": "화",
  "4": "수",
  "5": "목",
  "6": "금",
  "7": "토",
};

const MoreList = ({
  viewRef,
  moreModalRef,
  listRef,
  allListRef,
  clickedElement,
}: T) => {
  const dispatch = useAppDispatch();

  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const modal = useSelector((state: RootState) => state.modal);

  const date: string = modal.date;

  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    viewRef.current!.clientHeight,
  ]);

  useEffect(() => {
    const modalCloseHandler = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;

      clickedElement.current = target;

      if (!moreModalRef.current!.contains(target)) {
        // 밖의 영역중에서 더보기를 클릭한 경우
        for (const key in allListRef.current) {
          if (allListRef.current[key]?.contains(target)) return;
        }

        dispatch(modalActions.onOffModal({ type: "more" }));
        clickedElement.current = null;
      }
    };

    document.addEventListener("click", modalCloseHandler);
    return () => {
      document.removeEventListener("click", modalCloseHandler);
    };
  });

  useEffect(() => {
    const widthCalculator = () => {
      setSize([viewRef.current!.clientWidth, viewRef.current!.clientHeight]);
    };

    window.addEventListener("resize", widthCalculator);
  });

  const listClickHandler = (
    e: React.MouseEvent,
    object: CalenderData,
    index: number
  ) => {
    if (clickedElement.current === (e.target as HTMLDivElement)) {
      return dispatch(modalActions.onOffModal({ type: "list" }));
    }

    const giveDate = new Date(object.startDate);
    const day = String(giveDate.getDay() + 1);
    const week = String(Math.ceil((giveDate.getDate() + +day - 1) / 7));
    dispatch(
      cloneActions.setListInfo({ type: "List", ...object, day, week, index })
    );
    dispatch(modalActions.setListInfo({ type: "More", ...object, index }));
    dispatch(modalActions.onList());
  };

  const makeListHandler = () => {
    const result = [];

    if (!schedule[date]) {
      // 해당 날짜에 일정이 없을 때,
      return <div className="AllList-nothing">등록된 일정이 없습니다.</div>;
    }

    let count: number = 0;

    for (const key in schedule[date]) {
      const object = schedule[date][key];
      const index = count;
      let shape = "";

      switch (true) {
        case object.startDate === object.endDate:
          shape = "short";
          break;
        case object.startDate < date:
        case date < object.endDate:
          shape = "middle";
          break;
        case date === object.endDate:
          shape = "end";
          break;
        case date === object.startDate:
          shape = "start";
          break;
        default:
      }

      result.push(
        <div
          key={index}
          className="AllList-item"
          onClick={(e) => listClickHandler(e, object, index)}
        >
          {object.startDate < modal.date && (
            <div className={`end-date border-left-${object.color}`}></div>
          )}
          <div
            className={`title ${object.color}`}
            style={{
              width: `${widthObj[shape]}`,
              marginLeft: `${marginLeft[shape]}`,
              textDecoration: `${object.isDone && "line-through"}`,
            }}
          >
            {object.title}
          </div>
          {object.endDate >= modal.date && (
            <div className={`start-date border-right-${object.color}`}></div>
          )}
        </div>
      );
      count += 1;
    }

    return result;
  };

  const margin = ModalPositionTwo(modal.day, modal.week, size);

  return (
    <div
      className={`AllList on`}
      ref={moreModalRef}
      style={{
        display: `${size[0] === 0 ? "none" : "block"}`,
        marginLeft: `${size[0] !== 0 && margin![0]}px`,
        marginTop: `${size[0] !== 0 && margin![1]}px`,
      }}
    >
      <div className="AllList-header">
        <h2>{dayText[modal.day]}</h2>
        <button onClick={() => dispatch(modalActions.clearSet())}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <h3 className="AllList-date">{modal.date}</h3>
      <div className="AllList-box">{makeListHandler()}</div>
    </div>
  );
};

export default MoreList;
