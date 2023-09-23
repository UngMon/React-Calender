import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { ListOrMore } from "../type/RefType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CalenderData } from "../type/ReduxType";
import ModalPositionTwo from "../utils/ModalPositionTwo";
import "./MoreList.css";

interface T {
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<HTMLDivElement>;
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
  listRef,
  allListRef,
  clickedElement,
  list,
}: T) => {
  console.log("allList");

  const dispatch = useAppDispatch();

  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const modal = useSelector((state: RootState) => state.modal);

  const date: string = modal.date;

  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    viewRef.current!.clientHeight,
  ]);
  const modalRef = useRef<HTMLDivElement>(null);
  const listInMoreRef = useRef<ListOrMore>({});

  useEffect(() => {
    const modalCloseHandler = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      console.log('down')

      clickedElement.current = target;
      // 더 보기창 밖의 영역을 클릭한 경우
      if (!modalRef.current!.contains(target)) {
        console.log('why')
        // 밖의 영역중에서 더보기를 클릭한 경우
        for (const key in allListRef.current) {
          if(allListRef.current[key]!.contains(target)) return;
        }
        
        console.log('here')
        setTimeout(() => {
          dispatch(modalActions.toggleMore());
        }, 100);
      }
    };

    document.addEventListener("mouseup", modalCloseHandler);
    return () => {
      document.removeEventListener("mouseup", modalCloseHandler);
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
    date: string,
    index: number
  ) => {
    // clickedElement.current = e.target as HTMLDivElement;
    // const type = "ListInMore";
    // listInMoreRef.current = object.key;
    // const { day, week } = modal;
    // dispatch(
    //   modalActions.clickedList({ type, object, date, day, week, index })
    // );
  };

  const makeListHandler = () => {
    const result = [];

    if (!schedule[date])
      // 해당 날짜에 일정이 없을 때,
      return <div className="AllList-nothing">등록된 일정이 없습니다.</div>;

    let index: number = 0;

    for (const key in schedule[date]) {
      const object = schedule[date][key];
      let category = "";

      switch (true) {
        case object.startDate === object.endDate:
          category = "short";
          break;
        case object.startDate < date:
        case date < object.endDate:
          category = "middle";
          break;
        case date === object.endDate:
          category = "end";
          break;
        case date === object.startDate:
          category = "start";
          break;
        default:
      }

      result.push(
        <div
          key={index}
          className="AllList-item"
          // eslint-disable-next-line no-loop-func
          onClick={(e) => listClickHandler(e, object, date, index)}
          ref={(el: HTMLDivElement) => (listInMoreRef.current[`${key}`] = el)}
        >
          {object.startDate < modal.date && (
            <div className={`end-date border-left-${object.color}`}></div>
          )}
          <div
            className={`title ${object.color}`}
            style={{
              width: `${widthObj[category]}`,
              marginLeft: `${marginLeft[category]}`,
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
      index += 1;
    }

    return result;
  };

  const margin = ModalPositionTwo(modal.day, modal.week, size);

  return (
    <div
      className={`AllList on`}
      ref={modalRef}
      style={{
        display: `${size[0] === 0 ? "none" : "block"}`,
        marginLeft: `${size[0] !== 0 && margin![0]}px`,
        marginTop: `${size[0] !== 0 && margin![1]}px`,
      }}
    >
      <div className="AllList-header">
        <h2>{dayText[modal.day]}</h2>
        <button
          onClick={() => dispatch(modalActions.onoffModal({ type: "More" }))}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <h3 className="AllList-date">{modal.date}</h3>
      <div className="AllList-box">{makeListHandler()}</div>
    </div>
  );
};

export default MoreList;
