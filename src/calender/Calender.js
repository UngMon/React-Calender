import { useState } from "react";
import AddEvent from "./AddEvent";
import "./Calender.css";

// const week = [0, 1, 2, 3, 4, 5, 6]


const Calender = (props) => {
  const [eventMordal, setEventMordal]  = useState(false);

  let thisDates = []; //div태그 생성을 위한 날짜 배열 생성
  let differenceDay = 0;

  if (props.prevDay === 0) {
    thisDates.push(props.prevDate);

    for (let i = 1; i <= props.lastDayOfThisMonth; i++) {
      thisDates.push(i);
    }

    differenceDay = 35 - thisDates.length;

    if (differenceDay > 0) {
      for (let j = 1; j < differenceDay + 1; j++) {
        thisDates.push(j);
      }
    }
  } else if (props.prevDay === 6) {
    for (let i = 1; i < props.lastDayOfThisMonth + 1; i++) {
      thisDates.push(i);
    }
    differenceDay = 35 - thisDates.length;
    for (let j = 1; j < differenceDay + 1; j++) {
      thisDates.push(j);
    }
  } else {
    for (let i = props.prevDate - props.prevDay; i < props.prevDate + 1; i++) {
      thisDates.push(i);
    }
    for (let j = 1; j < props.lastDayOfThisMonth + 1; j++) {
      thisDates.push(j);
    }
    if (thisDates.length > 35) {
      differenceDay = 42 - thisDates.length;
    } else {
      differenceDay = 35 - thisDates.length;
    }
    if (differenceDay > 0) {
      for (let k = 1; k < differenceDay + 1; k++) {
        thisDates.push(k);
      }
    }
  }

  const dateClickHandler = () => {
    setEventMordal((prevState) => !prevState)
    console.log(eventMordal);
  };

  const thisDateLength = thisDates.length / 7;

  return (
    <div>
      <div className="weekname">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      <div className="presentation">
        <div className={thisDateLength === 6 ? "week-six" : "week-fifth"}>
          {thisDates.map((date, idx) => (
            <div key={idx} className="calender_div" onClick={dateClickHandler}>
              <div className="calender_day">{date}</div>
            </div>
          ))}
        </div>
      </div>
      {eventMordal && <AddEvent />}
    </div>
  );
};

export default Calender;
