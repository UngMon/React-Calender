import React, { useEffect, useState } from "react";
import { CalenderData, DataType, ModalType } from "../type/ReduxType";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { cloneActions } from "../redux/clone-slice";
import { ListOrMore } from "../type/RefType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { morePosition } from "../utils/morePosition";
import "./MoreList.css";

interface T {
  data: DataType;
  modal: ModalType;
  lastweek: number;
  viewRef: React.RefObject<HTMLDivElement>;
  moreModalRef: React.MutableRefObject<HTMLDivElement | null>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  list: React.RefObject<HTMLDivElement>;
}

const widthObj: { [key: string]: string } = {
  short: "194px",
  middle: "170.1px",
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
  data,
  modal,
  lastweek,
  viewRef,
  moreModalRef,
  allListRef,
  clickedElement,
  list,
}: T) => {
  const dispatch = useAppDispatch();

  const schedule = data.userSchedule;
  const clickDate: string = modal.date;

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

        if (list.current?.contains(target)) return;

        dispatch(modalActions.clearSet({ type: "all" }));
        clickedElement.current = null;
      }
    };

    document.addEventListener("click", modalCloseHandler);
    return () => {
      document.removeEventListener("click", modalCloseHandler);
    };
  });

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(modalActions.clearSet({ type: "all" }));
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  useEffect(() => {
    const widthCalculator = () => {
      setSize([viewRef.current!.clientWidth, viewRef.current!.clientHeight]);
    };

    window.addEventListener("resize", widthCalculator);
    return () => window.removeEventListener("resize", widthCalculator);
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
      cloneActions.setListInfo({
        type: "List",
        ...object,
        day,
        week,
        index: index > 3 ? 3 : index,
      })
    );
    dispatch(
      modalActions.setListInfo({
        type: "More",
        ...object,
        index: index > 3 ? 3 : index,
      })
    );
    dispatch(modalActions.onList());
  };

  const makeListHandler = () => {
    const result = [];

    if (!schedule[clickDate]) {
      // 해당 날짜에 일정이 없을 때,
      return <div className="AllList-nothing">등록된 일정이 없습니다.</div>;
    }

    let count: number = 0;

    for (const key in schedule[clickDate]) {
      const object = schedule[clickDate][key];
      const index = count;
      let shape = "";

      switch (true) {
        case object.startDate === object.endDate:
          shape = "short";
          break;
        case object.startDate < clickDate:
        case clickDate < object.endDate:
          shape = "middle";
          break;
        case clickDate === object.endDate:
          shape = "end";
          break;
        case clickDate === object.startDate:
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
          {object.endDate > modal.date && (
            <div className={`start-date border-right-${object.color}`}></div>
          )}
        </div>
      );
      count += 1;
    }

    return result;
  };

  const 좌표 = morePosition(modal.day, modal.week, size, lastweek);

  return (
    <div
      className={`AllList on`}
      ref={moreModalRef}
      style={{
        left: 좌표![0],
        top: 좌표![1],
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="AllList-header">
        <h2>{dayText[modal.day]}</h2>
        <button
          onClick={() => dispatch(modalActions.clearSet({ type: "all" }))}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <h3 className="AllList-date">{modal.date}</h3>
      <div className="AllList-container">
        <div className="AllList-box">{makeListHandler()}</div>
      </div>
    </div>
  );
};

export default MoreList;
