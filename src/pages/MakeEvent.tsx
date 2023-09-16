import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import MobileTimePicker from "../ui/MobileTimePicker";
import SetTime from "../utils/Time/SetTime";
import "./MakeEvent.css";

const time = SetTime();

const MakeEvent = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const [openDateSelector, setOpenDate] = useState<boolean>(false);
  const [openTimeSelector, setOpenTime] = useState<boolean>(false);
  const [type, setType] = useState<string>("");

  const startTime = modal.startTime || time.currentTime;
  const endTime = modal.endTime || time.lastTime;

  const openHandler = (v: string, t: string) => {
    if (v === "date") setOpenDate(!openDateSelector);
    else setOpenTime(!openTimeSelector);
    setType(t);
  };

  return (
    <div className="MakeEvent">
      <form className="Make-Form">
        <div className="X-mark">
          <div>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <label htmlFor="title"></label>
        <input type="text" id="title" name="title" placeholder="제목 추가" />
        <div className="fa-clock">
          <FontAwesomeIcon icon={faClock} className="Make-clock-icon" />
        </div>
        <div className="Make-time">
          <div className="time">
            <div onClick={() => openHandler("date", "start")}>
              <span>{modal.startDate}</span>
            </div>
            <div onClick={() => openHandler("time", "start")}>
              <span>{startTime}</span>
            </div>
          </div>
          <div className="arrow">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <div className="time">
            <div onClick={() => openHandler("date", "end")}>
              <span>{modal.endDate}</span>
            </div>
            <div onClick={() => openHandler("time", "end")}>
              <span>{endTime}</span>
            </div>
          </div>
        </div>
        {openDateSelector && <div className="date-selector"></div>}
        {openTimeSelector && (
          <MobileTimePicker
            type={type}
            startTime={startTime}
            endTime={endTime}
          />
        )}
        <button type="button">취소</button>
        <button type="submit">생성</button>
      </form>
    </div>
  );
};

export default MakeEvent;
