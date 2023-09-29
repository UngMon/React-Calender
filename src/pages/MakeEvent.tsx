import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ListOrMore } from "../type/RefType";
import MobileTimePicker from "../ui/MobileTimePicker";
import SetTime from "../utils/Time/SetTime";
import Month from "../utils/miniCalender/Secon-Month";
import "./MakeEvent.css";
import { modalActions } from "../redux/modal-slice";

const time = SetTime();

const date = new Date().toISOString().split("T")[0];

const MakeEvent = () => {
  const dispatch = useAppDispatch();

  const modal = useSelector((state: RootState) => state.modal);
  const [openDateSelector, setOpenDate] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [openTimeSelector, setOpenTime] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [type, setType] = useState<string>("");

  const dateRef = useRef<ListOrMore>({});
  const startDateRef = useRef<HTMLSpanElement>(null);
  const endDateRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<HTMLSpanElement>(null);
  const endTimeRef = useRef<HTMLSpanElement>(null);

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

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (modal.startDate > modal.endDate) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }

    if (modal.startTime > modal.endTime) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }
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
          <div className="fa-clock">
            <FontAwesomeIcon icon={faClock} className="Make-clock-icon" />
          </div>
          <div className="Make-time">
            <div className="time">
              <div onTouchEnd={(e) => openHandler("date", "start")}>
                <span ref={startDateRef}>{modal.startDate || date}</span>
              </div>
              <div onTouchEnd={(e) => openHandler("time", "start")}>
                <span ref={startTimeRef}>{startTime}</span>
              </div>
            </div>
            <div className="arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div className="time">
              <div onTouchEnd={(e) => openHandler("date", "end")}>
                <span ref={endDateRef}>{modal.endDate || date}</span>
              </div>
              <div onTouchEnd={(e) => openHandler("time", "end")}>
                <span ref={endTimeRef}>{endTime}</span>
              </div>
            </div>
          </div>
          <div className="picker-box">
            {openDateSelector[0] && (
              <Month platform="mobile" type={openDateSelector[1]} dateRef={dateRef} />
            )}
            {openTimeSelector[0] && (
              <MobileTimePicker
                type={type}
                startTime={startTime}
                endTime={endTime}
              />
            )}
          </div>
          <button className="mobile-button" type="submit">
            생성
          </button>
        </form>
      )}
    </div>
  );
};

export default MakeEvent;
