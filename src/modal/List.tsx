import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../store/data-slice";
import { timeActions } from "../store/time-slice";
import { modalActions } from "../store/modal-slice";
import { RootState } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListOrMore } from "../utils/RefType";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "../library/Time/TimeSelector";
import ColorBox from "../library/ColorBox";
import ModalPosition from "../library/ModalPosition";
import "./List.css";

interface T {
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<HTMLDivElement>;
  list: React.RefObject<HTMLDivElement>;
}

const List = ({ viewRef, listRef, allListRef, clickedElement, list }: T) => {
  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);
  const schedule = data.userSchedule;

  //?????? check
  const startDate = data.startDate || modal.startDate;
  const endDate = data.endDate || modal.endDate;

  const date =
    modal.startDate === modal.endDate
      ? modal.startDate.split("-")
      : [...modal.startDate.split("-"), ...modal.endDate.split("-")];

  const [color, setColor] = useState<string>(modal.color);
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    viewRef.current!.clientHeight,
  ]); //check
  const [openEditArea, setOpenEditArea] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const timeOneRef = useRef<HTMLInputElement>(null);
  const timeTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([viewRef.current!.clientWidth, viewRef.current!.clientHeight]);
    };

    window.addEventListener("resize", widthCalculator);
  });

  // const comparison = comparisonHandler(startDate, endDate);

  useEffect(() => {
    //check 수정 필요
    const closeHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      // 색상 선택 on, off
      if (!colorRef.current!.contains(target) && openColor) {
        setTimeout(() => {
          setOpenColor(false);
        }, 100);
      }

      // 같은 리스트를 클릭하면 모달창이 종료되게하기
      if (target === clickedElement.current!) {
        setTimeout(() => {
          dispatch(modalActions.offModal());
        }, 100);
        return;
      }

      // list 모달창 영역 밖을 클릭했을 때,
      if (!list.current!.contains(target)) {
        for (const key in listRef.current) {
          if (listRef.current[key] === null) continue;

          if (!listRef.current[key]!.contains(target)) continue;

          clickedElement.current = target as HTMLDivElement;
          return;
        }

        for (const key in allListRef.current) {
          if (allListRef.current[key] === null) continue;

          if (!allListRef.current[key]!.contains(target)) continue;

          clickedElement.current = target as HTMLDivElement;
          setTimeout(() => {
            dispatch(modalActions.offModal());
          }, 100);
          return;
        }

        setTimeout(() => {
          // !allListState.isVisible && dispatch(listActions.offModal());
          dispatch(modalActions.offModal());
          dispatch(timeActions.resetTime());
        }, 80);
      }
    };

    document.addEventListener("mousedown", closeHandler);
    return () => {
      document.removeEventListener("mousedown", closeHandler);
    };
  });

  const removeListHandler = (date: string, key: string) => {
    dispatch(dataActions.removeList({ date, key }));
    dispatch(modalActions.offModal());
  };

  const listEditHandler = (startDate: string, endDate: string) => {
    // const day = new Date(startDate).getDay() + 1;
    const day = modal.day;
    const arr = data.dateArray;
    const key = modal.key;
    console.log(day);

    // if (modal.moreModalOpen)
    //   dispatch(modalActions.offModal());

    setOpenEditArea((prevState) => !prevState);
    // 리스트 클릭시 modla-slice의 startDate와 endDate값이 원하는 값이 아니기에
    // 클릭할 때 값을 갱신해줘야 함. 추가로 arr 배열도..
    dispatch(dataActions.setDate({ day, startDate, endDate, arr, key })); //check arr 부분
  };

  const editListSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const key = modal.key;

    // const time = new Date();
    // const month = time.getMonth();
    // const datee = time.getDate();
    // const timeArr = [
    //   time.getFullYear(),
    //   month.toString().padStart(2, '0'),
    //   datee.toString().padStart(2, '0'),
    //   time.toTimeString(),
    // ];

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    let title: string = inputRef.current!.value;
    const startTime: string = timeOneRef.current!.value || modal.startTime;
    const endTime: string = timeTwoRef.current!.value || modal.endTime;

    if (!pattern.test(timeOneRef.current!.value)) {
      return alert("시간을 제대로 입력해주세요! ex) 오후 02:30");
    }

    if (!pattern.test(timeTwoRef.current!.value)) {
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
    }

    if (startTime > endTime)
      return alert("시작시간이 끝나는 시간보다 큽니다!!");
    // if (comparison === 4) {
    // }

    if (startDate > endDate) return alert("마지막 날이 시작날 보다 작습니다!!");

    if (title.length === 0) title = inputRef.current!.placeholder;

    dispatch(dataActions.removeList({ startDate, key }));

    dispatch(dataActions.makeList({ startTime, endTime, title, color }));

    inputRef.current!.value = "";

    closeModalHandler();
  };

  const listDoneHandler = (date: string, key: string) => {
    dispatch(dataActions.listDone({ date, key }));
  };

  const closeModalHandler = () => {
    dispatch(modalActions.offModal());
    dispatch(timeActions.resetTime());
  };

  const styleClass = schedule[modal.startDate][modal.key].isDone
    ? "done"
    : false;

  const marginSize =
    size[0] !== 0 ? ModalPosition(modal.day, modal.week, size) : false;

  return (
    <div
      className={`list-box ${openEditArea ? "edit" : ""}`}
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
        <div onClick={() => removeListHandler(startDate, modal.key)}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div
          className="fa-check"
          onClick={() => listDoneHandler(startDate, modal.key)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="fa-xmark" onClick={closeModalHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      {openEditArea && (
        <form
          className="list-edit-form"
          onSubmit={(e: React.FormEvent) => editListSubmitHandler(e)}
        >
          <div className="edit-list">
            <img
              src="img/memo.png"
              alt="memo"
              width="17"
              className="input-icon"
            />
            <input placeholder={modal.title} type="text" ref={inputRef} />
          </div>
          <TimeSelector
            startDate={startDate}
            endDate={endDate}
            firstTime={modal.startTime}
            lastTime={modal.endTime}
            timeOneRef={timeOneRef}
            timeTwoRef={timeTwoRef}
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
      {!openEditArea && (
        <div className="list-info">
          <div className="list-title">
            <div className={`list-color-box ${modal.color}`}></div>
            <div className={`listName  ${styleClass}`}>{modal.title}</div>
          </div>
          <div className="list-time">
            <div className="time-item">{`${date[0]}년 ${date[1]}월 ${date[2]}일`}</div>
            <div className="time-item">{modal.startTime}</div>
            <span className="time-item">~</span>
            <div
              className="time-item"
              style={{ display: date.length === 3 ? "none" : "" }}
            >
              {`${
                date.length < 4
                  ? "" // startDate === endDate
                  : date[0] === date[3] // 같은 년도
                  ? date[1] === date[4] // 같은 달
                    ? `${date[5]}일` // 다른 날
                    : `${date[4]}월 ${date[5]}일` // 다른 달
                  : `${date[3]}년 ${date[4]}월 ${date[5]}일` // 다른 년도
              }
              `}
            </div>
            <div className="time-item">{modal.endTime}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
