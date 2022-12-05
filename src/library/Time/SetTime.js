const SetTime = () => {
  
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();
  console.log(typeof hour);

  let currentTime = "";
  let lastTime = "";

  const hourMakeHandler = (hour) => {
    if (hour < 10) {
      currentTime = "오전 0" + hour;
      lastTime = "오전 0" + (hour + 1);
      console.log(currentTime);
    }

    if (hour === 10) {
      currentTime = "오전 10";
      lastTime = "오전 11";
    }

    if (hour === 11) {
      currentTime = "오전 11";
      lastTime = "오후 00";
    }

    if (hour === 12) {
      currentTime = "오후 00";
      lastTime = "오후 01";
    }

    if (12 < hour) {
      if (hour < 22) {
        currentTime = "오후 0" + (hour - 12);
        lastTime = "오후 0" + (hour - 11);
      }

      if (hour === 21) {
        lastTime = "오후 10";
      }
    }

    if (hour === 22) {
      currentTime = "오후 10";
      lastTime = "오후 11";
    }

    if (hour === 23) {
      currentTime = "오후 11";
      lastTime = "오전 00";
    }

    if (hour === 24) {
      currentTime = "오전 00";
      lastTime = "오전 01";
    }
  };

  minute = Math.ceil(minute / 15) * 15;
  console.log(minute);

  if (minute === 60) {
    minute = "00";
    hourMakeHandler(hour + 1);
    console.log(currentTime);
  }

  if (minute === 0) {
    hourMakeHandler(hour);
    minute = "00";
  }

  if (0 < minute < 60) {
    hourMakeHandler(hour);
  }

  currentTime = currentTime + ":" + minute;
  lastTime = lastTime + ":" + minute;
  console.log(currentTime);

  return { currentTime, lastTime };
};

export default SetTime;
