import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import "./AllList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { modalActions } from "../store/modal-slice";
import { listActions } from "../store/list-slice";

const AllList = ({ viewRef, listRef, allListRef, clickedElement, list }) => {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.userSchedule.schedule);
  const listIsVisible = useSelector((state) => state.list.isVisible);
  const allModal = useSelector((state) => state.all);

  const [size, setSize] = useState([0, 0]);
  const modalRef = useRef();
  const clickedAllListRef = useRef();

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
          console.log("listRef?");
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
          console.log("allListRef?");
          clickedAllListRef.current = allListRef.current[key];
          return;
        }
      }

      if (listIsVisible && list.current.contains(e.target)) {
        return;
      }
      
      setTimeout(() => {
        console.log("마지막");
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        if (!listIsVisible) dispatch(modalActions.offModal());
      }, 90);
      return;
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

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const listClickHandler = (event, item, listIdx) => {
    clickedElement.current = event.target;
    const week = allModal.week;
    const dayIndex = allModal.day;
    const listName = item.title;
    const listIndex = listIdx;
    const scheduleIndex = allModal.index;
    const key = item.index;
    dispatch(
      listActions.clickedList({
        week,
        dayIndex,
        listName,
        listIndex,
        scheduleIndex,
        key,
      })
    );
  };

  const makeListHandler = () => {
    return schedule[allModal.index].todo.map((item, listIdx) => (
      <div
        key={listIdx}
        className="AllList-item"
        onClick={(event) => listClickHandler(event, item, listIdx)}
      >
        {item.isEnd && (
          <div className={`end-date border-left-${item.color}`}></div>
        )}
        {item.isMiddle && (
          <div className={`end-date border-left-${item.color}`}></div>
        )}
        <div
          className={`title ${item.color}`}
          style={{
            width: `${
              item.isShort
                ? "194px"
                : item.isMiddle
                ? item.isEnd
                  ? "183px"
                  : "174px"
                : item.isStart
                ? item.isEnd
                  ? "174px"
                  : "183px"
                : item.isEnd && "183px"
            }`,
            borderRadius: `3px`,
            marginLeft: `${
              item.isShort ? "0px" : item.isLong && !item.isEnd ? "0px" : "9px"
            }`,
            textDecoration: `${item.style && "line-through"}`,
          }}
        >
          {item.title}
        </div>
        {item.isMiddle && item.isEnd ? null : (
          <div className={`start-date border-right-${item.color}`}></div>
        )}
      </div>
    ));
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

  const modalPosition = useCallback((day, week, size) => {
    if (size[0] === 0) return;

    const width = size[0];
    const height = size[1];

    const array = [0, 0];

    if (day === 1)
      array[0] = width > 350 ? (width * (day - 1)) / 7 : width / 2 - 120;

    if (day === 2)
      array[0] = width > 350 ? (width * (day - 1)) / 7 : width / 2 - 120;

    if (day === 3)
      array[0] = width > 350 ? (width * (day - 1)) / 7 : width / 2 - 120;

    if (day === 4)
      array[0] =
        width > 320 ? width - 230 - (width * 3) / 7 + 60 : width / 2 - 115;

    if (day === 5)
      array[0] =
        width > 320 ? width - 230 - (width * 2) / 7 + 50 : width / 2 - 115;

    if (day === 6)
      array[0] = width > 320 ? width - 230 - width / 7 + 20 : width / 2 - 115;

    if (day === 7) array[0] = width > 320 ? width - 230 - 10 : width / 2 - 115;
    ////////////////////////////////////////////////

    if (week === 1) array[1] = 10;

    if (week === 2) array[1] = (height * (week - 1)) / 6;

    if (week === 3) array[1] = height - 240 - (height * 2) / 6;

    if (week === 4) array[1] = height - 240 - height / 6;

    if (week === 5) array[1] = height - 240;

    if (week === 6) array[1] = height - 240;

    return array;
  }, []);

  const marginPsition = modalPosition(allModal.day, allModal.week, size);

  return (
    <div
      className={`AllList`}
      ref={modalRef}
      style={{
        display: `${size[0] === 0 ? "none" : "block"}`,
        marginLeft: `${size[0] !== 0 && marginPsition[0]}px`,
        marginTop: `${size[0] !== 0 && marginPsition[1]}px`,
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
