import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/data-slice";
import { listActions } from "../store/list-slice";
import { allListActions } from "../store/all-list-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ModalPositionTwo from "../library/ModalPositionTwo";
import "./AllList.css";

const AllList = ({ viewRef, listRef, allListRef, clickedElement, list }) => {
  console.log("allList");

  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.userSchedule.schedule);
  const allModal = useSelector((state) => state.all);
  const listIsVisible = useSelector((state) => state.list.isVisible);

  const dateInfo = allModal.date.split("-");
  const year = dateInfo[0];
  const month = dateInfo[1];
  const date = allModal.date;

  const [size, setSize] = useState([0, 0]);
  const modalRef = useRef();
  const makeListRef = useRef({});
  const clickedAllListRef = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const addModalCloseHandler = (e) => {
    if (clickedAllListRef.current === e.target) {
      setTimeout(() => {
        dispatch(allListActions.offModal());
      }, 100);
      return;
    }

    if (allModal.isVisible && !modalRef.current.contains(e.target)) {
      for (const key in listRef.current) {
        if (listRef.current[key] === null) {
          continue;
        }

        if (listRef.current[key].contains(e.target)) {
          clickedAllListRef.current = listRef.current[key];
          setTimeout(() => {
            dispatch(allListActions.offModal());
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

      if (listIsVisible && list.current.contains(e.target)) {
        return;
      }

      setTimeout(() => {
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        if (!listIsVisible) dispatch(modalActions.offModal());
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
        dispatch(listActions.offModal());
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
    const week = allModal.week;
    const day = allModal.day;
    const title = object.title;
    const key = object.key;
    const arr = object.arr;
    dispatch(
      listActions.clickedList({
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

    if (!schedule[year][month][date]) {
      result.push(
        <div className="AllList-nothing">등록된 일정이 없습니다.</div>
      );
    }

    let objectIndex = 0;

    for (const key in schedule[year][month][date]) {
      const object = schedule[year][month][date][key];

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
    dispatch(allListActions.offModal());
    dispatch(listActions.offModal());
  };

  const dayChangeHandler = () => {
    return allModal.day === 1
      ? "일"
      : allModal.day === 2
      ? "월"
      : allModal.day === 3
      ? "화"
      : allModal.day === 4
      ? "수"
      : allModal.day === 5
      ? "목"
      : allModal.day === 6
      ? "금"
      : "토";
  };

  const marginPsition = ModalPositionTwo(allModal.day, allModal.week, size);

  return (
    <div
      className={`AllList`}
      ref={modalRef}
      style={{
        display: `${size[0] === 0 ? "none" : "block"}`,
        marginLeft: `${size[0] !== 0 && marginPsition[0]}px`,
        marginTop: `${size[0] !== 0 && marginPsition[1]}px`,
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
      <h3 className="AllList-date">{allModal.date}</h3>
      <div className="AllList-box">{makeListHandler()}</div>
    </div>
  );
};

export default AllList;
