import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import { allListActions } from "../store/all-list-slice";
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

const List = ({ listRef }) => {
  const dispatch = useDispatch();

  const listState = useSelector((state) => state.list);
  const modalState = useSelector((state) => state.modal);

  const index = listState.scheduleIndex;
  const listIndex = listState.listIndex;

  const schedule = modalState.userSchedule.schedule;

  const listInfo = schedule[index].todo[listIndex];

  const dateArray =
    listInfo.startDate === listInfo.endDate
      ? listInfo.startDate.split("-")
      : [...listInfo.startDate.split("-"), ...listInfo.endDate.split("-")];

  const [editArea, setEditArea] = useState(false);
  const [color, setColor] = useState(listInfo.color);
  const [openColor, setOpenColor] = useState(false);

  const startDate = modalState.startDate;
  const endDate = modalState.endDate;

  const modalRef = useRef();
  const clickedListRef = useRef();
  const inputRef = useRef();
  const colorRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  const comparison = comparisonHandler(startDate, endDate);

  const modalCloseHandler = (e) => {
    let closeBool = true;
    console.log(clickedListRef.current);

    if (openColor) {
      // 색상 선택 on, off
      if (!colorRef.current.contains(e.target)) {
        setTimeout(() => {
          setOpenColor(false);
        }, [100]);
      }
    }

    if (e.target === clickedListRef.current) {
      setTimeout(() => {
        console.log(`?????`);
        dispatch(listActions.offModal());
      }, 100);
      return;
    }

    if (!modalRef.current.contains(e.target)) {
      for (const key in listRef.current) {
        if (listRef.current[key].contains(e.target)) {
          clickedListRef.current = e.target;
          closeBool = false;
          console.log(e.target);
          console.log("working");
          break;
        }
      }
      console.log(e.target)
      console.log(closeBool)
      if (closeBool) {
        console.log('??????????')
        dispatch(listActions.offModal());
        dispatch(allListActions.offModal());
        return;
      }

      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(timeActions.resetTime());
      }, 100);
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
      console.log(modalState.longArrChanged);
      console.log(modalState.longArr);
      console.log(longArr);
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

  const listDoneHandler = (index, listIndex) => {
    dispatch(modalActions.listDone({ index, listIndex }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.offModal());
    dispatch(modalActions.resetState());
  };

  const styleClass =
    schedule[index].todo[listIndex].style && !editArea && "done";

  return (
    <form
      className={`list-box ${ModalPosition(
        listState.dayIndex,
        listState.week
      )}`}
      ref={modalRef}
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
          <div className="buttonBox">
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
            <div>{`${dateArray[0]}년 ${dateArray[1]}월 ${dateArray[2]}일`}</div>
            <div>{schedule[index].todo[listIndex].startTime}</div>
            <span>~</span>
            <div
              style={{ display: dateArray.length === 3 && "none" }}
            >{`${dateArray[3]}년 ${dateArray[4]}월 ${dateArray[5]}일`}</div>
            <div>{schedule[index].todo[listIndex].endTime}</div>
          </div>
        </div>
      )}
    </form>
  );
};

export default List;
