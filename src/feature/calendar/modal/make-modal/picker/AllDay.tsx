import React from "react";

interface Props {
  type: "make" | "edit";
  time_category: "allday" | "time" | undefined;
  setIsAllday: (isAllday: "allday" | "time", category: "make" | "edit") => void;
}

const AllDay = ({ type, time_category, setIsAllday }: Props) => {
  console.log(time_category);

  const handleToggle = () => {
    console.log("?????");
    setIsAllday(time_category === "time" ? "allday" : "time", type)
  };
  return (
    <div className="time-date-box__header">
      <div className="time-date-box__title">
        <span className="material-symbols-outlined time-date-box__icon">
          nest_clock_farsight_analog
        </span>
        <span className="time-date-box__label">
          {time_category === "allday" ? "하루종일" : "시간 설정"}
        </span>
      </div>

      <button
        type="button"
        aria-pressed={time_category === "time"}
        className={`time-date-box__toggle ${time_category === "time" ? "is-active" : ""}`}
        onClick={handleToggle}
      >
        <div
          className={`time-date-box__toggle-thumb ${
            time_category === "time" ? "is-active" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default React.memo(AllDay);
