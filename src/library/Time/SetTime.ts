const SetTime = () => {
  
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let currentTime = "";
  let lastTime = "";

  const hourMakeHandler = (hour: number) => {
    if (hour < 9) {
      currentTime = "오전 0" + hour;
      lastTime = "오전 0" + (hour + 1);
    }

    if (hour === 9) {
      currentTime = '오전 0' + hour;
      lastTime = '오전 ' + (hour + 1);
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

  if (minute === 60) {
    minute = 0;
    hourMakeHandler(hour + 1);
  }

  if (minute === 0) {
    hourMakeHandler(hour);
    minute = 0;
  }

  if (0 < minute && minute < 60) {
    hourMakeHandler(hour);
  }

  currentTime = currentTime + ":" + minute;
  lastTime = lastTime + ":" + minute;

  return { currentTime, lastTime };
};

export default SetTime;
