import React from "react";
import DateBox from "./DateBox";
import TimeBox from "./TimeBox";

interface Props {
  order: "start" | "end";
  isAllDay: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const TimeDateGroup = ({ order, isAllDay, setIsExpanded }: Props) => {
  return (
    <div className="time-date-box__group">
      <DateBox order={order} setIsExpanded={setIsExpanded} />
      {!isAllDay && <TimeBox order={order} setIsExpanded={setIsExpanded} />}
    </div>
  );
};
export default TimeDateGroup;
