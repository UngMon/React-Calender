import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { ListOrMore } from "../type/RefType";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { UserData } from "../type/ReduxType";
import { auth } from "../Auth/firebase";
import { sendUserData } from "../redux/fetch-action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeDateArray } from "../utils/MakeLongArr";
import MobileTimePicker from "../ui/MobileTimePicker";
import SetTime from "../utils/Time/SetTime";
import Month from "../utils/miniCalender/Secon-Month";
import {
  faPenToSquare,
  faTrashCan,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import ColorBox from "../utils/Time/ColorBox";
import "./MobileMakeEvent.css";

const nowTime = SetTime();

const date = new Date().toISOString().split("T")[0];

const MakeEvent = () => {
  const dispatch = useAppDispatch();
  const param = useParams();

  const data = useSelector((state: RootState) => state.data);
  const clone = useSelector((state: RootState) => state.clone);
  const time = useSelector((state: RootState) => state.time);

  const [openDateSelector, setOpenDate] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [openTimeSelector, setOpenTime] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [type, setType] = useState<string>("");
  const [color, setColor] = useState<string>(clone.color || "라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<ListOrMore>({});
  const startDateRef = useRef<HTMLSpanElement>(null);
  const endDateRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<HTMLSpanElement>(null);
  const endTimeRef = useRef<HTMLSpanElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth > 500) {
        navigate(-1);
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  });

  useEffect(() => {
    const touchHandler = (e: TouchEvent) => {
      if (!colorRef.current!.contains(e.target as Node)) setOpenColor(false);
    };

    window.addEventListener("touchend", touchHandler);

    return () => window.removeEventListener("touchend", touchHandler);
  });

  let startTime = time.firstTime || clone.startTime || nowTime.currentTime;
  let endTime = time.lastTime || clone.endTime || nowTime.lastTime;

  const openHandler = (v: string, t: string) => {
    if (v === "date") {
      setOpenTime([false, ""]);
      setOpenDate([
        openDateSelector[1] === t ? false : true,
        openDateSelector[1] === t ? "" : t,
      ]);
    } else {
      setOpenTime([
        openTimeSelector[1] === t ? false : true,
        openTimeSelector[1] === t ? "" : t,
      ]);
      setOpenDate([false, ""]);
    }
    setType(t);
  };

  const deleteAndCreate = (type: string) => {
    const schedule = JSON.parse(JSON.stringify(data.userSchedule));
    let dateArray = makeDateArray(clone.startDate, clone.endDate);
    // 기존 항목 삭제 하고..
    if (param.edit === "edit") {
      for (let date of dateArray) {
        delete schedule[date][clone.key];
      }
    }

    const parameter: MakeListParameter = {
      title: inputRef.current?.value || clone.title,
      startDate: clone.startDate,
      endDate: clone.endDate,
      startTime,
      endTime,
      color,
      userSchedule: schedule,
    };
    console.log(parameter);
    // 새롭게 설정된 기간에 일정 생성 후에
    const newSchedule: UserData =
      type === "create" ? MakeList(parameter) : schedule;

    // 데이터 전송
    dispatch(
      sendUserData({ newSchedule, uid: auth.currentUser!.uid, type: "POST" })
    );

    navigate(-1);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit");
    if (clone.startDate > clone.endDate) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }

    if (clone.startDate === clone.endDate) {
      if (startTime > endTime) {
        alert("종료 시간이 시작시간 보다 뒤에 있어야 합니다.");
        return;
      }
    }

    deleteAndCreate("create");
  };

  return (
    <div className="MakeEvent">
      {window.innerWidth > 500 && (
        <div className="MakeEvent-announce">
          <div>
            <p>모바일 전용 페이지 입니다.</p>
            <button onClick={() => navigate(-1)}>뒤로 가기</button>
          </div>
        </div>
      )}
      {window.innerWidth <= 500 && (
        <form className="Make-Form" onSubmit={submitHandler}>
          <div className="X-mark">
            <div onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <label htmlFor="title"></label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder={clone.title || "제목 추가"}
            ref={inputRef}
          />
          <ColorBox
            platform={"mobile"}
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
            colorRef={colorRef}
          />
          <div className="fa-clock">
            <FontAwesomeIcon icon={faClock} className="Make-clock-icon" />
          </div>
          <div className="Make-time">
            <div className="time">
              <div
                className={openDateSelector[1] === "start" ? "clicked" : ""}
                onTouchEnd={() => openHandler("date", "start")}
              >
                <span ref={startDateRef}>{clone.startDate || date}</span>
              </div>
              <div
                className={openTimeSelector[1] === "start" ? "clicked" : ""}
                onTouchEnd={() => openHandler("time", "start")}
              >
                <span ref={startTimeRef}>{startTime}</span>
              </div>
            </div>
            <div className="arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div className="time">
              <div
                className={openDateSelector[1] === "end" ? "clicked" : ""}
                onTouchEnd={() => openHandler("date", "end")}
              >
                <span ref={endDateRef}>{clone.endDate || date}</span>
              </div>
              <div
                className={openTimeSelector[1] === "end" ? "clicked" : ""}
                onTouchEnd={() => openHandler("time", "end")}
              >
                <span ref={endTimeRef}>{endTime}</span>
              </div>
            </div>
          </div>
          <div className="picker-box">
            {openDateSelector[0] && (
              <Month
                platform="mobile"
                type={openDateSelector[1]}
                dateRef={dateRef}
              />
            )}
            {openTimeSelector[0] && (
              <MobileTimePicker
                type={type}
                startTime={startTime}
                endTime={endTime}
              />
            )}
          </div>
          <div className="bottom-ui">
            <button
              className="mobile-button"
              type="button"
              onTouchEnd={() => deleteAndCreate("delete")}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span>삭제</span>
            </button>
            <button className="mobile-button" type="submit">
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>생성</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MakeEvent;
