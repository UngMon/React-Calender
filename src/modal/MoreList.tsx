import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { modalActions } from "../store/modal-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ModalPositionTwo from "../library/ModalPositionTwo";
import "./MoreList.css";

interface T {
  listRef: React.MutableRefObject<{}>;
  allListRef: React.MutableRefObject<{}>;
  clickedElement: React.MutableRefObject<{}>;
  viewRef: React.RefObject<HTMLDivElement>;
  list: React.MutableRefObject<{}>;
}

const MoreList = ({ viewRef, listRef, allListRef, clickedElement, list }: T) => {
  console.log("allList");

  const dispatch = useAppDispatch();

  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const modal = useSelector((state: RootState) => state.modal);

  // const dateInfo: string[] = modal.date.split("-");
  // const year: string = dateInfo[0];
  // const month: string = dateInfo[1];
  const date: string = modal.date;

  const [size, setSize] = useState<[number, number]>([0, 0]);
  const modalRef = useRef<HTMLDivElement>(null);
  const makeListRef = useRef({});
  const clickedAllListRef = useRef({});

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const addModalCloseHandler = (e) => {
    if (clickedAllListRef.current === e.target) {
      setTimeout(() => {
        dispatch(modalActions.offModal());
      }, 100);
      return;
    }

    if (modal.moreModalOpen && !modalRef.current.contains(e.target)) {
      for (const key in listRef.current) {
        if (listRef.current[key] === null) {
          continue;
        }

        if (listRef.current[key].contains(e.target)) {
          clickedAllListRef.current = listRef.current[key];
          setTimeout(() => {
            dispatch(modalActions.offModal());
          }, 50);
          return;
        }
      }

      for (const key in allListRef.current) {
        if (allListRef.current[key] === null) {
          continue;
        }

        if (allListRef.current[key].contains(e.target)) {
          clickedAllListRef.current = allListRef.current[key];
          return;
        }
      }

      if (modal.listModalOpen && list.current.contains(e.target)) {
        return;
      }

      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(modalActions.offModal());
        if (!modal.listModalOpen) dispatch(modalActions.offModal());
      }, 90);
      return;
    }

    for (const key in makeListRef.current) {
      if (makeListRef.current[key].contains(e.target)) {
        return;
      }
    }

    if (modalRef.current.contains(e.target)) {
      setTimeout(() => {
        dispatch(modalActions.offModal());
      }, 100);
    }
  };

  useEffect(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  const widthCalculator = useCallback(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  useEffect(() => {
    window.addEventListener("resize", widthCalculator);
  });

  const listClickHandler = (event, object) => {
    clickedElement.current = event.target;
    const style = object.style;
    const color = object.color;
    const startDate = object.startDate;
    const endDate = object.endDate;
    const startTime = object.startTime;
    const endTime = object.endTime;
    const week = modal.week;
    const day = modal.day;
    const title = object.title;
    const key = object.key;
    const arr = object.arr;
    dispatch(
      modalActions.clickedList({
        style,
        color,
        startDate,
        endDate,
        startTime,
        endTime,
        week,
        day,
        title,
        key,
        arr,
      })
    );
  };

  const makeListHandler = () => {
    const result = [];

    if (!schedule[date]) {
      result.push(
        <div className="AllList-nothing">등록된 일정이 없습니다.</div>
      );
    }

    let objectIndex = 0;

    for (const key in schedule[date]) {
      const object = schedule[date][key];
      result.push(
        <div
          key={objectIndex}
          className="AllList-item"
          onClick={(event) => listClickHandler(event, object)}
          ref={(el) => {
            makeListRef.current[`${key}`] = el;
          }}
        >
          {(object.isEnd || object.isMiddle) && (
            <div className={`end-date border-left-${object.color}`}></div>
          )}
          <div
            className={`title ${object.color}`}
            style={{
              width: `${
                object.isLong
                  ? object.isMiddle
                    ? "170.179px"
                    : object.isStart
                    ? object.isEnd && "170.1491px"
                    : "182px"
                  : "194px"
              }`,
              marginLeft: `${
                !object.isLong ? "0px" : !object.Start && "10.909px"
              }`,
              textDecoration: `${object.style && "line-through"}`,
            }}
          >
            {object.title}
          </div>
          {(object.isStart || object.isMiddle) && (
            <div className={`start-date border-right-${object.color}`}></div>
          )}
        </div>
      );
      objectIndex += 1;
    }

    return result;
  };

  const cancelHandler = () => {
    dispatch(modalActions.offModal());
  };

  const dayChangeHandler = () => {
    return modal.day === '1'
      ? "일"
      : modal.day === '2'
      ? "월"
      : modal.day === '3'
      ? "화"
      : modal.day === '4'
      ? "수"
      : modal.day === '5'
      ? "목"
      : modal.day === '6'
      ? "금"
      : "토";
  };

  const margin = ModalPositionTwo(modal.day, modal.week, size);

  return (
    <div
      className={`AllList`}
      ref={modalRef}
      style={{
        display: `${size[0] === 0 ? "none" : "block"}`,
        marginLeft: `${size[0] !== 0 && margin![0]}px`,
        marginTop: `${size[0] !== 0 && margin![1]}px`,
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="AllList-header">
        <h2>{dayChangeHandler()}</h2>
        <button onClick={cancelHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <h3 className="AllList-date">{modal.date}</h3>
      <div className="AllList-box">{makeListHandler()}</div>
    </div>
  );
};

export default MoreList;
