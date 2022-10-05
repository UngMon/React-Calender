const SetTime = () => {
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  console.log(hour)
  console.log(minute)

  let currentTime = "";
  let lastTime = "";

  const hourMakeHandler = (hour) => {
    if (hour < 13) {
      if (hour < 10) {
        currentTime = "오전 0" + hour;
        lastTime = "오전 0" + (hour + 1);
      } else {
        if (hour === 11) {
          currentTime = "오전 " + hour;
          lastTime = "오후 00";
        } else if (hour === 12) {
          hour = "0";
          currentTime = "오후 " + hour + '0';
          lastTime = "오후 " + (hour + 1);
        } else {
          currentTime = "오전 " + hour;
          lastTime = "오전 " + (hour + 1);
        }
      }
    } else {
      if (hour < 22) {
        currentTime = '오후 0' + (hour - 12);
        lastTime = "오후 0" + (hour - 11);
        if (hour === 21) {
          lastTime = '오후 10'; 
        }
      }else {
        currentTime = "오후 " + (hour - 12);
        lastTime = "오후" + (hour - 11);
        if (hour === 23) {
          lastTime = '오전 00';
        } else if (hour === 24 ){
          currentTime = '오전 00';
          lastTime = '오전 01';
        }
      }
    }
  };

  minute = Math.ceil(minute / 15) * 15;

  if (minute === 60) {
    minute = '00';
    hourMakeHandler((hour + 1));
  } else {
    hourMakeHandler(hour);
  }

  currentTime = currentTime + ":" + minute;
  lastTime = lastTime + ":" + minute;

  return { currentTime, lastTime };
};

export default SetTime;
