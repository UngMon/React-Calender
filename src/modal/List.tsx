import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/data-slice";
import { timeActions } from "../store/time-slice";
import { comparisonHandler } from "../library/Comparioson";
import ModalPosition from "../library/ModalPosition";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "../library/Time/TimeSelector";
import ColorBox from "../library/ColorBox";
import { allListActions } from "../store/all-list-slice";

const List = ({ viewRef, listRef, allListRef, clickedElement, list }) => {
  const dispatch = useDispatch();

  const listState = useSelector((state) => state.list);
  const modalState = useSelector((state) => state.modal);
  const allListState = useSelector((state) => state.all);
  const schedule = modalState.userSchedule;

  const startDate = modalState.startDate || listState.startDate;
  const endDate = modalState.endDate || listState.endDate;

  const dateArray =
    listState.startDate === listState.endDate
      ? listState.startDate.split("-")
      : [...listState.startDate.split("-"), ...listState.endDate.split("-")];

  const [editArea, setEditArea] = useState(false);
  const [color, setColor] = useState(listState.color);
  const [openColor, setOpenColor] = useState(false);
  const [size, setSize] = useState(["", ""]);

  const inputRef = useRef();
  const colorRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  useEffect(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  const widthCalculator = useCallback(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  useEffect(() => {
    window.addEventListener("resize", widthCalculator);
  });

  const comparison = comparisonHandler(startDate, endDate);

  const modalCloseHandler = (e) => {
    if (openColor) {
      // 색상 선택 on, off
      if (!colorRef.current.contains(e.target)) {
        setTimeout(() => {
          setOpenColor(false);
        }, [100]);
      }
    }
    // 같은 리스트를 클릭하면 모달창이 종료되게 끔..
    if (e.target === clickedElement.current) {
      setTimeout(() => {
        dispatch(listActions.offModal());
      }, 100);
      return;
    }

    if (!list.current.contains(e.target)) {
      for (const key in listRef.current) {
        if (listRef.current[key] === null) {
          continue;
        }

        if (listRef.current[key].contains(e.target)) {
          clickedElement.current = e.target;
          return;
        }
      }

      for (const key in allListRef.current) {
        if (allListRef.current[key] === null) {
          continue;
        }

        if (allListRef.current[key].contains(e.target)) {
          clickedElement.current = e.target;
          setTimeout(() => {
            dispatch(listActions.offModal());
          }, 100);
          return;
        }
      }

      setTimeout(() => {
        !allListState.isVisible && dispatch(listActions.offModal());
        dispatch(modalActions.offModal());
        dispatch(timeActions.resetTime());
      }, 80);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", modalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", modalCloseHandler);
    };
  });

  const removeListHandler = (date, key) => {
    dispatch(modalActions.removeList({ date, key }));
    dispatch(listActions.offModal());
  };

  const listEditHandler = (startDate, endDate) => {
    const day = new Date(startDate).getDay() + 1;
    const arr = listState.arr;
    const key = listState.key;
    console.log(day);

    if (allListState.isVisible) {
      dispatch(allListActions.offModal());
    }
    setEditArea((prevState) => !prevState);
    // 리스트 클릭시 modla-slice의 startDate와 endDate값이 원하는 값이 아니기에
    // 클릭할 때 값을 갱신해줘야 함. 추가로 arr 배열도..
    dispatch(modalActions.setDate({ day, startDate, endDate, arr, key }));
  };

  const editListSubmitHandler = (event) => {
    event.preventDefault();
    const key = listState.key;

    const time = new Date();
    const month = time.getMonth();
    const datee = time.getDate();
    const timeArr = [
      time.getFullYear(),
      month < 10 ? "0" + month : month,
      datee < 10 ? "0" + datee : datee,
      time.toTimeString(),
    ];

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    let title = inputRef.current.value;
    const date = listState.startDate;
    let startTime = timeOneRef.current.value || listState.startTime;
    let endTime = timeTwoRef.current.value || listState.endTime;

    if (!timeOneRef.current.value.length === 0) {
      if (!pattern.test(timeOneRef.current.value)) {
        return alert("시간을 제대로 입력해주세요! ex) 오후 02:30");
      }
    }

    if (!timeTwoRef.current.value.length === 0) {
      if (!pattern.test(timeTwoRef.current.value)) {
        return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
      }
    }

    if (startTime > endTime) {
      if (comparison === 4) {
        return alert("시작시간이 끝나는 시간보다 큽니다!!");
      }
    }

    if (comparison === 5) {
      return alert("마지막 날이 시작날 보다 작습니다!!");
    }

    if (title.trim() === "") {
      title = inputRef.current.placeholder;
    }

    // startTime < endTime 이면서...
    dispatch(modalActions.removeList({ date, key }));

    if (comparison === 4) {
      dispatch(
        modalActions.inputList({ startTime, endTime, title, color, timeArr })
      );
    }

    if (comparison <= 3) {
      dispatch(
        modalActions.longDateList({
          startTime,
          endTime,
          title,
          timeArr,
          color,
        })
      );
    }

    inputRef.current.value = "";

    closeModalHandler();
  };

  const listDoneHandler = (date, key) => {
    dispatch(modalActions.listDone({ date, key }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.offModal());
    dispatch(modalActions.offModal());
    dispatch(timeActions.resetTime());
  };
  console.log(schedule[listState.startDate][listState.index])
  const styleClass = schedule[listState.startDate][listState.index].isDone
    ? "done"
    : false;

  const marginSize =
    size[0] !== "" ? ModalPosition(listState.day, listState.week, size) : false;

  return (
    <div
      className={`list-box ${editArea ? "edit" : ""}`}
      ref={list}
      style={{
        // 마운트시에 width 가 ''이므로 display none
        display: `${!marginSize ? "none" : "block"}`,
        marginLeft: `${marginSize && marginSize[0]}px`,
        marginTop: `${marginSize && marginSize[1]}px`,
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="option-box">
        <div onClick={() => listEditHandler(startDate, endDate)}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div onClick={() => removeListHandler(startDate, listState.key)}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div
          className="fa-check"
          onClick={() => listDoneHandler(startDate, listState.key)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="fa-xmark" onClick={closeModalHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      {editArea && (
        <form className="list-edit-form" onSubmit={editListSubmitHandler}>
          <div className="edit-list">
            <img
              src="img/memo.png"
              alt="memo"
              width="17"
              className="input-icon"
            />
            <input placeholder={listState.title} type="text" ref={inputRef} />
          </div>
          <TimeSelector
            startDate={startDate}
            endDate={endDate}
            firstTime={listState.startTime}
            lastTime={listState.endTime}
            timeOneRef={timeOneRef}
            timeTwoRef={timeTwoRef}
            comparison={comparison}
            viewRef={viewRef}
          />
          <ColorBox
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
            colorRef={colorRef}
          />
          <div className="edit-button-box">
            <button type="submit">저장</button>
          </div>
        </form>
      )}
      {!editArea && (
        <div className="list-info">
          <div className="list-title">
            <div className={`list-color-box ${listState.color}`}></div>
            <div className={`listName  ${styleClass}`}>{listState.title}</div>
          </div>
          <div className="list-time">
            <div className="time-item">{`${dateArray[0]}년 ${dateArray[1]}월 ${dateArray[2]}일`}</div>
            <div className="time-item">{listState.startTime}</div>
            <span className="time-item">~</span>
            <div
              className="time-item"
              style={{ display: dateArray.length === 3 && "none" }}
            >
              {`${
                dateArray.length < 4
                  ? "" // startDate === endDate
                  : dateArray[0] === dateArray[3] // 같은 년도
                  ? dateArray[1] === dateArray[4] // 같은 달
                    ? `${dateArray[5]}일` // 다른 날
                    : `${dateArray[4]}월 ${dateArray[5]}일` // 다른 달
                  : `${dateArray[3]}년 ${dateArray[4]}월 ${dateArray[5]}일` // 다른 년도
              }
              `}
            </div>
            <div className="time-item">{listState.endTime}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
