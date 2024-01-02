import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { cloneActions } from "../redux/clone-slice";
import { ListOrMore } from "../type/RefType";
import {
  DataType,
  ModalBasicType,
  ModalType,
  UserData,
} from "../type/ReduxType";
import { sendUserData } from "../redux/fetch-action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import PickerBox from "../utils/Time/PickerBox";
import ColorBox from "../utils/Time/ColorBox";
import { makeDateArray } from "../utils/MakeLongArr";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { listPosition } from "../utils/listPosition";
import { markDate } from "../utils/markDate";
import "./List.css";

interface T {
  data: DataType;
  clone: ModalBasicType;
  modal: ModalType;
  uid: string;
  lastweek: number;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  list: React.RefObject<HTMLDivElement>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({
  data,
  clone,
  modal,
  uid,
  lastweek,
  viewRef,
  listRef,
  clickedElement,
  list,
  setIsDragging,
}: T) => {
  const dispatch = useAppDispatch();

  const startDate = clone.startDate || modal.startDate;
  const endDate = clone.endDate || modal.endDate;

  const date = [...startDate.split("-"), ...endDate.split("-")];

  const [animaOn, setAnimaOn] = useState<boolean>(true);
  const [color, setColor] = useState<string>(modal.color || "라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    (viewRef.current!.clientHeight - 26) / lastweek,
  ]);
  const [openDate, setOpenDate] = useState<[boolean, string]>([false, ""]);
  const [openTime, setOpenTime] = useState<[boolean, string]>([false, ""]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timeInputOneRef = useRef<HTMLInputElement>(null);
  const timeInputTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([
        viewRef.current!.clientWidth,
        (viewRef.current!.clientHeight - 26) / lastweek,
      ]);
    };

    window.addEventListener("resize", widthCalculator);

    return () => window.removeEventListener("resize", widthCalculator);
  });

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModalHandler();
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;

      // List 모달 영역 밖 클릭한 경우,
      if (!list.current?.contains(target)) {
        if (clickedElement.current?.contains(target)) {
          // list 밖 같은 리스트를 클릭하면 리스트 창이 닫게함.
          return !modal.moreModalOpen && closeModalHandler();
        }

        // clickedElement Ref에 target저장
        clickedElement.current = e.target as HTMLDivElement;

        for (const key in listRef.current) {
          if (listRef.current[key]?.contains(target)) return;
        }
        // 위 영역이 아닌 다른 영역을 클릭한 경우 list 모달창 닫음.
        closeModalHandler();
      }
    };

    document.addEventListener("click", closeHandler);

    return () => {
      document.removeEventListener("click", closeHandler);
    };
  });

  const removeListHandler = (key: string) => {
    const dateArray = makeDateArray(modal.startDate, modal.endDate);

    const newSchedule: UserData = JSON.parse(JSON.stringify(data.userSchedule));

    for (const item of dateArray) {
      delete newSchedule[item][key];
    }

    dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
    dispatch(modalActions.clearSet({ type: "all" }));
  };

  const editButtonHandler = () => {
    setIsDragging((prevState) => !prevState);
    dispatch(modalActions.clickedEdit());
  };

  const editListSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    let title: string = inputRef.current!.value;
    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    const startTime: string = timeInputOneRef.current!.value || clone.startTime;
    const endTime: string = timeInputTwoRef.current!.value || clone.endTime;

    if (!pattern.test(startTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 02:30");

    if (!pattern.test(endTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");

    if (startDate > endDate) return alert("마지막 날이 시작날 보다 작습니다!!");

    if (startTime > endTime && startDate === endDate)
      return alert("시작시간이 끝나는 시간보다 큽니다!!");

    if (title.length === 0) title = inputRef.current!.placeholder;

    const schedule = JSON.parse(JSON.stringify(data.userSchedule));
    const dateArray = makeDateArray(modal.startDate, modal.endDate);
    // 기존 항목 삭제 하고..
    for (let date of dateArray) {
      delete schedule[date][modal.key];
    }

    const parameter: MakeListParameter = {
      title,
      startDate: clone.startDate,
      endDate: clone.endDate,
      startTime,
      endTime,
      color,
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
    const dateArray = makeDateArray(modal.startDate, modal.endDate);

    for (const item of dateArray) {
      newSchedule[item][key].isDone = !newSchedule[item][key].isDone;
    }
    dispatch(sendUserData({ newSchedule, uid, type: "POST" }));
  };

  const closeModalHandler = () => {
    setAnimaOn(false);
    setIsDragging(false);
    setTimeout(() => {
      console.log("close Modal Handler");
      clickedElement.current = null;
      dispatch(
        modalActions.clearSet({
          type: modal.moreModalOpen ? "list" : "all",
        })
      );
      dispatch(cloneActions.clearSet());
    }, 100);
  };

  const styleClass = data.userSchedule[modal.startDate]?.[modal.key]?.isDone
    ? "done"
    : false;

  const corDay = modal.openEdit ? clone.day : modal.day;
  const corWeek = modal.openEdit ? clone.week : modal.week;
  const 좌표 = listPosition(corDay, corWeek, size, modal.openEdit, modal.index);
  const markD = markDate(modal.startDate, modal.endDate);

  return (
    <div
      className={`list-box ${animaOn ? "on" : "off"} ${
        modal.openEdit ? "edit" : ""
      }`}
      ref={list}
      style={{
        left: 좌표[0],
        ...(modal.openEdit && modal.week > "3" ? {} : { top: 좌표[1] }),
        ...(modal.openEdit && modal.week > "3" ? { bottom: 좌표[1] } : {}),
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="option-box">
        <div onClick={editButtonHandler}>
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
      {modal.openEdit && (
        <form
          className="list-edit-form"
          onSubmit={(e: React.FormEvent) => editListSubmitHandler(e)}
        >
          <div className="edit-title">
            <div>
              <img src="../images/memo.png" alt="memo" width="18" />
            </div>
            <div>
              <input placeholder={modal.title} type="text" ref={inputRef} />
            </div>
          </div>
          <PickerBox
            startDate={startDate}
            endDate={endDate}
            openDate={openDate}
            setOpenDate={setOpenDate}
            time={[clone.startTime, clone.endTime]}
            openTime={openTime}
            setOpenTime={setOpenTime}
            timeInputOneRef={timeInputOneRef}
            timeInputTwoRef={timeInputTwoRef}
          />
          <ColorBox
            platform={"pc"}
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
          />
          <div className="edit-button-box">
            <button type="submit">저장</button>
          </div>
        </form>
      )}
      {!modal.openEdit && (
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
