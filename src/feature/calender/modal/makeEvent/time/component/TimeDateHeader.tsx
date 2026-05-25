import React from "react";

interface Props {
  isAllDay: boolean;
  onToggleAllDay: () => void;
}

const TimeDateHeader = ({ isAllDay, onToggleAllDay }: Props) => {
  return (
    <div className="time-date-box__header">
      <div className="time-date-box__title">
        <span className="material-symbols-outlined time-date-box__icon">
          nest_clock_farsight_analog
        </span>
        <span className="time-date-box__label">
          {isAllDay ? "하루 종일" : "시간 설정"}
        </span>
      </div>

      <button
        type="button"
        aria-pressed={isAllDay}
        className={`time-date-box__toggle ${isAllDay ? "is-active" : ""}`}
        onClick={onToggleAllDay}
      >
        <div
          className={`time-date-box__toggle-thumb ${
            isAllDay ? "is-active" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default React.memo(TimeDateHeader);