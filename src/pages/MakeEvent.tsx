import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ListOrMore } from "../type/RefType";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { UserData } from "../type/ReduxType";
import { auth } from "../Auth/firebase";
import { sendUserData } from "../redux/fetch-action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import MobileTimePicker from "../ui/MobileTimePicker";
import SetTime from "../utils/Time/SetTime";
import Month from "../utils/miniCalender/Secon-Month";
import "./MakeEvent.css";
import {
  faPenToSquare,
  faTrashCan,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import ColorBox from "../utils/Time/ColorBox";

const time = SetTime();

const date = new Date().toISOString().split("T")[0];

const MakeEvent = () => {
  const dispatch = useAppDispatch();
  // const loca = useLocation();
  const param = useParams();
  // const [params] = useSearchParams();

  // console.log(loca, param, params.get("edit"));

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);

  const [dateArray] = useState<string[]>(modal.dateArray);
  const [openDateSelector, setOpenDate] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [openTimeSelector, setOpenTime] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [type, setType] = useState<string>("");
  const [color, setColor] = useState<string>(modal.color || '라벤더');
  const [openColor, setOpenColor] = useState<boolean>(false);

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

  const startTime = modal.startTime || time.currentTime;
  const endTime = modal.endTime || time.lastTime;

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
    console.log("delete");
    const schedule = JSON.parse(JSON.stringify(data.userSchedule));

    // 기존 항목 삭제 하고..
    if (param.edit === 'edit') {
      for (let date of dateArray) {
        delete schedule[date][modal.key];
      }
    }

    const parameter: MakeListParameter = {
      title: modal.title,
      startDate: modal.startDate,
      endDate: modal.endDate,
      startTime,
      endTime,
      color,
      dateArray: modal.dateArray,
      userSchedule: schedule,
    };

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
    if (modal.startDate > modal.endDate) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }

    if (modal.startDate === modal.endDate) {
      if (modal.startTime > modal.endTime) {
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
            placeholder={modal.title || "제목 추가"}
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
              <div onTouchEnd={() => openHandler("date", "start")}>
                <span ref={startDateRef}>{modal.startDate || date}</span>
              </div>
              <div onTouchEnd={() => openHandler("time", "start")}>
                <span ref={startTimeRef}>{startTime}</span>
              </div>
            </div>
            <div className="arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div className="time">
              <div onTouchEnd={() => openHandler("date", "end")}>
                <span ref={endDateRef}>{modal.endDate || date}</span>
              </div>
              <div onTouchEnd={() => openHandler("time", "end")}>
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
