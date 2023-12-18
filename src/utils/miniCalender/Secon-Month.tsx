import React from "react";
import { useSelector } from "react-redux";
import { dateActions } from "../../redux/date-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
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
  const dispatch = useAppDispatch();
  const date = useSelector((state: RootState) => state.date);
  const navigate = useNavigate();

  //pc => /calender/date?year=''&month=''
  const [param] = useSearchParams();
  let year = param.get("year") ?? date.year;
  let month = param.get("month") ?? date.month;

  const moveMonthHandler = (type: string) => {
    if (type === "prev") {
      if (+month === 1) {
        month = "12";
        year = String(+year - 1);
      } else {
        month = String(+month - 1).padStart(2, "0");
      }
    } else {
      if (month === "12") {
        month = "01";
        year = String(+year + 1);
      } else {
        month = String(+month + 1).padStart(2, "0");
      }
    }

    if (platform === "mobile") {
      return dispatch(dateActions.setDate({ year, month }));
    }

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
            onClick={() => moveMonthHandler("prev")}
            type="button"
            ref={(el: HTMLButtonElement) => (dateRef.current[2] = el)}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              style={{ backgroundColor: "transparent" }}
            />
          </button>
          <button
            onClick={() => moveMonthHandler("next")}
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
      />
    </div>
  );
};

export default Month;
