import classes from "./Calender.module.css";

const Calender = (props) => {
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


  return (
    <div className={classes.calender}>
      {thisDates.map((date, idx) => (
        <div key={idx} className={classes.calender_div}>
          <div className={classes.calender_day}>{date}</div>
        </div>
      ))}
    </div>
  );
};

export default Calender;
