import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Calender from "./Secon-Caledner";
import pc from "./pc.module.css";
import mobile from "./mobile.module.css";

interface T {
  platform: string;
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
}

const Month = ({ platform, type, dateRef }: T) => {
  console.log("secondMonth");

  const date = useSelector((state: RootState) => state.date);
  const navigate = useNavigate();

  //pc => /calender/date?year=''&month=''
  const [param] = useSearchParams();
  let year = param.get("year") || date.year;
  let month = param.get("month") || date.month;

  const movePrevMonthHandler = () => {
    switch (+month) {
      case 1:
        month = "12";
        year = String(+year - 1);
        break;
      default:
        month = String(+month - 1).padStart(2, "0");
    }
    if (!year || !month) return;
    navigate(`/calender/date?year=${year}&month=${month}`);
  };

  const moveNextMonthHandler = () => {
    switch (month) {
      case "12":
        month = "01";
        year = String(+year + 1);
        break;
      default:
        month = String(+month + 1).padStart(2, "0");
    }
    if (!year || !month) return;
    navigate(`/calender/date?year=${year}&month=${month}`);
  };

  return (
    <div
      className={`${
        platform === "pc" ? pc["container"] : mobile["container"]
      } ${platform === "pc" && pc["platform-pc"]}`}
    >
      <div
        className={
          platform === "pc" ? pc["month-picker"] : mobile["month-picker"]
        }
      >
        <div>
          <span>
            {year}년 {+month}월
          </span>
        </div>
        <div>
          <button
            onClick={movePrevMonthHandler}
            type="button"
            ref={(el: HTMLButtonElement) => (dateRef.current[2] = el)}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              style={{ backgroundColor: "transparent" }}
            />
          </button>
          <button
            onClick={moveNextMonthHandler}
            type="button"
            ref={(el: HTMLButtonElement) => (dateRef.current[3] = el)}
          >
            <FontAwesomeIcon
              icon={faAngleRight}
              style={{ backgroundColor: "transparent" }}
            />
          </button>
        </div>
      </div>
      <Calender
        platform={platform}
        type={type}
        year={+year}
        month={+month}
        dateRef={dateRef}
        // dateOpenHandler={dateOpenHandler}
      />
    </div>
  );
};

export default Month;
