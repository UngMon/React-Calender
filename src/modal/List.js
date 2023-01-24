import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
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
  console.log(listRef);
  const listState = useSelector((state) => state.list);
  const modalState = useSelector((state) => state.modal);
  const allListState = useSelector((state) => state.all);

  const index = listState.scheduleIndex;
  const listIndex = listState.listIndex;

  const schedule = modalState.userSchedule.schedule;

  const listInfo = schedule[index].todo[listIndex];
  const startDate = modalState.startDate || listInfo.startDate;
  const endDate = modalState.endDate || listInfo.endDate;

  const dateArray =
    startDate === endDate
      ? startDate.split("-")
      : [...startDate.split("-"), ...endDate.split("-")];

  const [editArea, setEditArea] = useState(false);
  const [color, setColor] = useState(listInfo.color);
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

    if (e.target === clickedElement.current) {
      setTimeout(() => {
        console.log(`?????`);
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
          console.log("llistRef???");
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
            console.log("allList 클릭했나?");
            dispatch(listActions.offModal());
          }, 100);
          return;
        }
      }

      setTimeout(() => {
        console.log("통과");
        console.log(e.target);
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

  const removeListHandler = (index, listIndex) => {
    dispatch(modalActions.removeList({ index, listIndex }));
    dispatch(listActions.offModal());
  };

  const listEditHandler = (startDate, endDate) => {
    if (allListState.isVisible) {
      dispatch(allListActions.offModal());
    }
    setEditArea((prevState) => !prevState);
    // 리스트 클릭시 modla-slice의 startDate와 endDate값이 원하는 값이 아니기에
    // 클릭할 때 값을 갱신해줘야 함.
    dispatch(modalActions.setDate({ startDate, endDate }));
  };

  const editListSubmitHandler = (event) => {
    event.preventDefault();

    const time = new Date();
    const key = [
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      time.toTimeString(),
    ];

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    let title = inputRef.current.value;
    let startTime = timeOneRef.current.value || listInfo.startTime;
    let endTime = timeTwoRef.current.value || listInfo.endTime;

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
    dispatch(modalActions.removeList({ index, listIndex }));

    const dayIndex =
      new Date(
        `${
          !modalState.longArrChanged ? listInfo.startDate : modalState.startDate
        }`
      ).getDay() + 1;
    console.log(dayIndex);
    if (comparison === 4) {
      dispatch(
        modalActions.inputList({ startTime, endTime, title, color, key })
      );
    }

    if (comparison <= 3) {
      console.log("여기?");

      const longArr = !modalState.longArrChanged ? listInfo.arr : undefined;

      dispatch(
        modalActions.longDateList({
          startTime,
          endTime,
          title,
          dayIndex,
          longArr,
          key,
          color,
        })
      );
    }

    inputRef.current.value = "";

    closeModalHandler();

    dispatch(modalActions.offModal());
    dispatch(modalActions.resetState());
    dispatch(timeActions.resetTime());
  };

  const listDoneHandler = (index, listIndex, year, month) => {
    dispatch(modalActions.listDone({ index, listIndex }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.offModal());
    dispatch(modalActions.resetState());
  };

  const styleClass =
    schedule[index].todo[listIndex].style && !editArea && "done";

  const marginSize =
    size[0] !== ""
      ? ModalPosition(listState.dayIndex, listState.week, size)
      : false;

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
    >
      <div className="option-box">
        <div
          onClick={() => listEditHandler(listInfo.startDate, listInfo.endDate)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div onClick={() => removeListHandler(index, listIndex)}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div
          className="fa-check"
          onClick={() => listDoneHandler(index, listIndex)}
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
            <input
              placeholder={listState.listName}
              type="text"
              ref={inputRef}
            />
          </div>
          <TimeSelector
            startDate={startDate}
            endDate={endDate}
            firstTime={listInfo.startTime}
            lastTime={listInfo.endTime}
            timeOneRef={timeOneRef}
            timeTwoRef={timeTwoRef}
            comparison={comparison}
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
            <div className={`list-color-box ${listInfo.color}`}></div>
            <div className={`listName  ${styleClass}`}>
              {listState.listName}
            </div>
          </div>
          <div className="list-time">
            <div className="time-item">{`${dateArray[0]}년 ${dateArray[1]}월 ${dateArray[2]}일`}</div>
            <div className="time-item">
              {schedule[index].todo[listIndex].startTime}
            </div>
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
            <div className="time-item">
              {schedule[index].todo[listIndex].endTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
