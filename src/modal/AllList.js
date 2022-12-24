import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import "./AllList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { modalActions } from "../store/modal-slice";
import { listActions } from "../store/list-slice";

const AllList = ({ listRef }) => {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.userSchedule.schedule);
  const allModal = useSelector((state) => state.all);

  const modalRef = useRef();
  const clickedAllListRef = useRef();

  const addModalCloseHandler = (e) => {
    console.log(clickedAllListRef)
    console.log(e.target)

    if (clickedAllListRef.current === e.target) {
      setTimeout(() => {
        dispatch(allListActions.offModal());
      }, 100);
      return;
    }

    if (allModal.isVisible && !modalRef.current.contains(e.target)) {
      for (const key in listRef.current) {
        if (listRef.current[key].contains(e.target)) {
          clickedAllListRef.current = listRef.current[key];
          dispatch(modalActions.offModal());
          break;
        }
      }
      return;
    }
    setTimeout(() => {
      console.log("offmodal");
      dispatch(allListActions.offModal());
      dispatch(modalActions.offModal());
    }, 100);
  };

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const listClickHandler = (item, listIdx) => {
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
        onClick={() => listClickHandler(item, listIdx)}
      >
        {item.isEnd && (
          <div className={`end-date border-left-${item.color}`}></div>
        )}
        {item.isMiddle && !item.isEnd && (
          <div className={`end-date border-left-${item.color}`}></div>
        )}
        <div
          className={`title ${item.color}`}
          style={{
            width: `${
              item.isShort
                ? "194px"
                : item.isStart
                ? "182.5px"
                : item.isEnd && "183px"
            }`,

            borderRadius: `3px`,
            margin: `${item.isShort ? "0" : item.isStart && "0px"}`,
          }}
        >
          {item.title}
        </div>
        {item.isMiddle && (
          <div className={`start-date border-right-${item.color}`}></div>
        )}
        {item.isStart && (
          <div className={`start-date border-right-${item.color}`}></div>
        )}
      </div>
    ));
  };

  const cancelHandler = () => {
    dispatch(allListActions.offModal());
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

  return (
    <div
      className={`AllList week-${allModal.week} day-${allModal.day}`}
      ref={modalRef}
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
