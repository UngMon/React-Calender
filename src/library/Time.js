const Time = () => {
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let currentTime = "";
  let lastTime = "";

  if (hour < 12) {
    if (hour < 10) {
      hour = "0" + hour;
    }
    currentTime = "오전 ";
    lastTime = "오전 ";
  } else {
    hour -= 12;
    currentTime = "오후 ";
    lastTime = "오후 ";
    if (hour < 10) {
      hour = "0" + hour;
    } else if (hour === 11) {
      lastTime = "오전";
    }
  }
 
  if (minute % 15 !== 0) {
    minute = Math.ceil(minute / 15) * 15;
    if (minute === 60) {
      hour += 1;
      minute = "00";
    }
    currentTime = currentTime + hour + ":" + minute;
    lastTime = lastTime + (hour + 1) + ":" + minute;
  } else {
    if (minute === 0) {
      minute = "0" + minute;
    }
    currentTime = currentTime + hour + ":" + minute;
    lastTime = lastTime + (hour + 1) + ":" + minute;
  }

  return { currentTime, lastTime };
};

export default Time;
