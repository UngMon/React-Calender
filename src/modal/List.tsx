import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { dataActions } from "../redux/data-slice";
import { timeActions } from "../redux/time-slice";
import { modalActions } from "../redux/modal-slice";
import { ListOrMore } from "../type/RefType";
import { DataType, ModalType, UserData } from "../type/ReduxType";
import { sendUserData } from "../redux/fetch-action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "../utils/Time/TimeSelector";
import ColorBox from "../utils/Time/ColorBox";
import ModalPosition from "../utils/ModalPosition";
import MakeLongArr from "../utils/MakeLongArr";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { markDate } from "../utils/markDate";
import "./List.css";

interface T {
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<HTMLDivElement>;
  list: React.RefObject<HTMLDivElement>;
  uid: string;
  data: DataType;
  modal: ModalType;
}

const List = ({
  viewRef,
  listRef,
  allListRef,
  clickedElement,
  list,
  uid,
  data,
  modal,
}: T) => {
  const dispatch = useAppDispatch();

  const startDate = modal.startDate;
  const endDate = modal.endDate;

  const date =
    modal.startDate === modal.endDate
      ? modal.startDate.split("-")
      : [...modal.startDate.split("-"), ...modal.endDate.split("-")];

  const [toggle, setToggle] = useState<boolean>(true);    
  const [color, setColor] = useState<string>(modal.color);
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    viewRef.current!.clientHeight,
  ]); //check
  const [openEditArea, setOpenEditArea] = useState<boolean>(false);
  const [listDateArray] = useState<string[]>(
    MakeLongArr(modal.startDate.split("-"), modal.endDate.split("-"))
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const timeOneRef = useRef<HTMLInputElement>(null);
  const timeTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([viewRef.current!.clientWidth, viewRef.current!.clientHeight]);
    };

    window.addEventListener("resize", widthCalculator);

    return () => window.removeEventListener("resize", widthCalculator);
  });

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      console.log("???");

      if (!list.current?.contains(target)) {
        // list 밖을 클릭할 경우

        if (clickedElement.current?.contains(target)) {
          // list 밖 같은 리스트를 클릭하면 리스트 창이 닫게함.
          setTimeout(() => {
            clickedElement.current = null;
            dispatch(modalActions.onoffModal({ type: "list" }));
          }, 150);
          return;
        }

        clickedElement.current = target; // clickedElement Ref에 target저장

        for (const key in listRef.current) {
          if (listRef.current[key]?.contains(target)) return;
        }

        for (const key in allListRef.current) {
          if (allListRef.current[key]!.contains(target)) {
            dispatch(modalActions.offList());
            return;
          }
        }

        // 위 두가지가 아닌 영역을 클릭한 경우 list 모달창 닫음.

        setTimeout(() => {
          dispatch(timeActions.resetTime());
          dispatch(modalActions.onoffModal({ type: "list" }));
        }, 0);
      }

      // 리스트 영역안에서 컬러선택창이 열려있고, 컬러선택 창 밖을 클릭 한 경우
      if (openColor && !colorRef.current?.contains(target)) {
        setTimeout(() => {
          setOpenColor(false);
        }, 150);
      }
    };
    document.addEventListener("click", closeHandler);
    return () => {
      document.removeEventListener("click", closeHandler);
    };
  });

  const removeListHandler = (key: string) => {
    const dateArray = MakeLongArr(
      modal.startDate.split("-"),
      modal.endDate.split("-")
    );

    const newSchedule: UserData = JSON.parse(JSON.stringify(data.userSchedule));

    for (const item of dateArray) {
      delete newSchedule[item][key];
    }

    dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
    dispatch(modalActions.onoffModal({ type: "list" }));
  };

  const editButtonHandler = (startDate: string, endDate: string) => {
    const day = modal.day;
    const week = modal.week;
    const dateArray = MakeLongArr(
      modal.startDate.split("-"),
      modal.endDate.split("-")
    );

    setOpenEditArea((prevState) => !prevState);
    dispatch(dataActions.setDate({ day, week, startDate, endDate, dateArray }));
  };

  const editListSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    let title: string = inputRef.current!.value;
    const startTime: string = timeOneRef.current!.value || modal.startTime;
    const endTime: string = timeTwoRef.current!.value || modal.endTime;

    if (!pattern.test(startTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 02:30");

    if (!pattern.test(endTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");

    if (startTime > endTime)
      return alert("시작시간이 끝나는 시간보다 큽니다!!");

    if (startDate > endDate) return alert("마지막 날이 시작날 보다 작습니다!!");

    if (title.length === 0) title = inputRef.current!.placeholder;

    const schedule = JSON.parse(JSON.stringify(data.userSchedule));

    // 기존 항목 삭제 하고..
    for (let date of listDateArray) {
      delete schedule[date][modal.key];
    }

    const parameter: MakeListParameter = {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      color,
      dateArray: data.dateArray,
      userSchedule: schedule,
    };
    // 새롭게 설정된 기간에 일정 생성 후에
    const newSchedule: UserData = MakeList(parameter);
    // 데이터 전송
    dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
    inputRef.current!.value = "";
    closeModalHandler();
  };

  const listDoneHandler = (key: string) => {
    const newSchedule = JSON.parse(JSON.stringify(data.userSchedule));
    const dateArray = MakeLongArr(
      modal.startDate.split("-"),
      modal.endDate.split("-")
    );

    for (const item of dateArray) {
      newSchedule[item][key].isDone = !newSchedule[item][key].isDone;
    }
    dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
  };

  const closeModalHandler = () => {
    setToggle(false);
    setTimeout(() => {
      dispatch(modalActions.offList());
      dispatch(timeActions.resetTime());
    }, 250)
  };

  const styleClass = data.userSchedule[modal.startDate][modal.key].isDone
    ? "done"
    : false;

  const marginSize =
    size[0] !== 0 ? ModalPosition(modal.day, modal.week, size) : false;

  const markD = markDate(modal.startDate, modal.endDate);

  return (
    <div
      className={`list-box ${openEditArea ? "edit" : ""} ${toggle ? 'on' : 'off'}`}
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
        <div onClick={() => editButtonHandler(startDate, endDate)}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div onClick={() => removeListHandler(modal.key)}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div className="fa-check" onClick={() => listDoneHandler(modal.key)}>
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
              src="../images/memo.png"
              alt="memo"
              width="17"
              className="input-icon"
            />
            <input placeholder={modal.title} type="text" ref={inputRef} />
          </div>
          <TimeSelector
            startDate={startDate}
            endDate={endDate}
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
            <div className="time-item">{markD[0]}</div>
            <div className="time-item">{modal.startTime}</div>
            <span className="time-item">~</span>
            <div
              className="time-item"
              style={{ display: date.length === 3 ? "none" : "" }}
            >
              {markD[1]}
            </div>
            <div className="time-item">{modal.endTime}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
